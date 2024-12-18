import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SECRET = envs.JWT_SECRET;

export class jwtAdapter {

    static async generateToken(payload: any, expiresIn: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
                if (err) {
                    return resolve(null);
                }

                resolve(token);
            });
        });


    }

    static async verifyToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return resolve(null);
                }

                resolve(decoded as T);
            });
        });
    }
}