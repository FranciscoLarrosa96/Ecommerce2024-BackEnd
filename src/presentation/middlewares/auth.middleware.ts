import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {
    constructor() {
    }

    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) {
            return res.status(401).json({ message: 'No token provided' });
        }

        if (!authorization.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const token = authorization.split(' ')[1] || '';

        try {
            const payload = await jwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            const user = await UserModel.findById(payload.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.body.user = UserEntity.fromObject(user);

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }


}