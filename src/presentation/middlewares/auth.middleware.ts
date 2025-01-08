import { NextFunction, Request, Response, RequestHandler } from "express";
import { jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    static validateAndRefreshJWT: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authorization = req.header('Authorization');
            if (!authorization) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }

            if (!authorization.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }

            const token = authorization.split(' ')[1] || '';

            // Verificar el token
            const payload = await jwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }

            // Buscar el usuario en la base de datos
            const user = await UserModel.findById(payload.id);
            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return;
            }

            // Verificar que `user.id` sea de tipo string o number
            if (typeof user.id !== 'string' && typeof user.id !== 'number') {
                throw new Error('User ID is not a valid string or number');
            }

            // Generar un nuevo token
            const newToken = await jwtAdapter.generateToken({ id: user.id.toString() });

            // Validar si el token fue generado correctamente
            if (!newToken) {
                res.status(500).json({ message: 'Failed to generate new token' });
                return;
            }

            // Agregar el usuario al objeto de la solicitud
            req.body.user = UserEntity.fromObject(user);

            // Agregar el nuevo token a la respuesta como un encabezado
            res.setHeader('x-new-token', newToken);
            // Pasar al siguiente middleware o controlador
            next();
        } catch (error) {
            next(error);
        }
    };
}
