import { NextFunction, Request, Response, RequestHandler } from "express";
import { jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    static validateJWT: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authorization = req.header('Authorization');
            if (!authorization) {
                res.status(401).json({ message: 'No token provided' });
                return; // Importante: Asegúrate de detener la ejecución con "return"
            }

            if (!authorization.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Invalid token' });
                return; // Detén la ejecución
            }

            const token = authorization.split(' ')[1] || '';

            // Verificar el token
            const payload = await jwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) {
                res.status(401).json({ message: 'Invalid token' });
                return; // Detén la ejecución
            }

            // Buscar el usuario en la base de datos
            const user = await UserModel.findById(payload.id);
            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return; // Detén la ejecución
            }

            // Agregar el usuario al objeto de la solicitud
            req.body.user = UserEntity.fromObject(user);

            // Pasar al siguiente middleware o controlador
            next();
        } catch (error) {
            next(error); // Pasar el error al manejador de errores global
        }
    };
}
