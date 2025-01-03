import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { googleVerify } from "../../config/google-token.verify";


export class AuthController {
    constructor(public readonly authService: AuthService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Internal server error' });
    };

    register = (req: Request, res: Response) => {

        const [error, registerDto] = RegisterUserDto.create(req.body);

        if (error) {
            res.status(400).json({ message: error });
            return
        }
        this.authService.registerUser(registerDto!)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    login = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) {
            res.status(400).json({ message: error });
            return
        }

        this.authService.login(loginUserDto!)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    loginGoogle = async (req: Request, res: Response) => {
        const token = req.body.token;
        const { name, email, picture } = await googleVerify(token);

        this.authService.loginUserGoogle(name, email, picture)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    validateEmail = (req: Request, res: Response) => {
        const token = req.params.token;

        this.authService.validateEmail(token)
            .then(() => {
                res.json({ message: 'Email validated' });
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }
}