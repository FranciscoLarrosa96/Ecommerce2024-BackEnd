import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../domain";


export class UserController {
    constructor(public readonly userService: UserService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Internal server error' });
    };

    getUserById = async (req: Request, res: Response) => {
        const authorization = req.header('Authorization');
        this.userService.getUserById(authorization!)
            .then((user) => {
                res.json(user);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}