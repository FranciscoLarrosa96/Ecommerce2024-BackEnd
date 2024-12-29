
import { bcryptAdapter, envs, jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


import { EmailService, SendMailOptions } from "./email.service";

export class AuthService {
    constructor(private readonly emailService: EmailService) {

    }
    async registerUser(registerUserDto: RegisterUserDto) {
        const user = await UserModel.findOne(
            {
                email: registerUserDto.email
            }
        );
        if (user) {
            throw CustomError.badRequest('Email already registered');
        }

        try {

            const newUser = new UserModel(registerUserDto);
            // Encriptar la contraseña
            newUser.password = bcryptAdapter.hash(registerUserDto.password);

            await newUser.save();


            // JWT para autenticar al usuario


            // Email de validación

            await this.sendValidationEmail(newUser.email);

            const { password, ...userEntity } = UserEntity.fromObject(newUser);
            const token = await jwtAdapter.generateToken({ id: newUser._id, email: newUser.email });

            if (!token) {
                throw CustomError.internalServerError('Error generating token');
            }
            return { user: userEntity, token };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    async loginUserGoogle(name: string, email: string, picture: string) {
        try {
            let userNew;
            const userDb = await UserModel.findOne(
                {
                    email
                }
            );
            if (userDb && userDb.googleUser) {
                return { user: userDb, token: await jwtAdapter.generateToken({ id: userDb.id, email: userDb.email }) };
            } else if (userDb && !userDb.googleUser) {
                throw CustomError.badRequest('Email already registered');
            } else {
                userNew = new UserModel(
                    {
                        name: name,
                        email: email,
                        googleUser: true,
                        password: '@@@',
                        img: picture
                    }
                );

                await userNew.save();
                const token = await jwtAdapter.generateToken({ id: userNew.id, email: userNew.email });

                if (!token) {
                    throw CustomError.internalServerError('Error generating token');
                }
                const { password, ...userEntity } = UserEntity.fromObject(userNew);

                return { user: userEntity, token };
            }
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }


    async login(loginUserDto: LoginUserDto) {
        // FindOne verifica si existe el usuario
        const user = await UserModel.findOne({
            email: loginUserDto.email
        });
        if (!user) {
            throw CustomError.badRequest('Invalid credentials');
        }

        // isMatch verifica si la contraseña es correcta
        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);


        if (!isMatch) {
            throw CustomError.badRequest('Invalid credentials');
        }


        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await jwtAdapter.generateToken({ id: user._id, email: user.email });

        if (!token) {
            throw CustomError.internalServerError('Error generating token');
        }

        return {
            user: userEntity,
            token
        }
    }


    private sendValidationEmail = async (email: string) => {

        const token = await jwtAdapter.generateToken({ email });

        if (!token) {
            throw CustomError.internalServerError('Error generating token');
        }
        //TODO: redireccionar a la página de validación o app
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validate Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            color: #333333;
        }
        .content p {
            margin: 15px 0;
            font-size: 16px;
            line-height: 1.5;
        }
          .button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold; /* Asegura que el texto sea más visible */
        color: #ffffff !important; /* Forzamos el color blanco */
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        text-align: center;
        margin-top: 20px;
        transition: background-color 0.3s ease;
    }
    .button:hover {
        background-color: #0056b3;
    }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
            background-color: #f9f9f9;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Validate Your Email</h1>
        </div>
        <div class="content">
            <p>Click the button below to validate your email and activate your account.</p>
            <a href=${link} class="button">Validate Email</a>
        </div>
        <div class="footer">
            <p>If you didn’t request this email, you can safely ignore it.</p>
        </div>
    </div>
</body>
</html>

        `;

        const options: SendMailOptions = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html
        }

        const isSet = await this.emailService.sendEmail(options);

        if (!isSet) {
            throw CustomError.internalServerError('Error sending email');
        }

        return true;

    }

    public validateEmail = async (token: string) => {
        const payload = await jwtAdapter.verifyToken(token);
        if (!payload) {
            throw CustomError.badRequest('Invalid token');
        }

        const { email } = payload as { email: string };

        if (!email) {
            throw CustomError.badRequest('Email not found in token');
        }

        const user = await UserModel.findOne({
            email
        });

        if (!user) {
            throw CustomError.badRequest('User not found with this email');
        }

        user.emailVerified = true;
        await user.save();
    }
}