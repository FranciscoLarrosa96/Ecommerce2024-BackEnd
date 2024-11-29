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

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1>Validate your email</h1>
        <p>Click the following link to validate your email</p>
        <a href="${link}">Validate email</a>
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