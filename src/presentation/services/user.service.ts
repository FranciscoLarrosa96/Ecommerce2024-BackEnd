import { jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, UserEntity } from "../../domain";


export class UserService {
    constructor() {
    }

    async getUserById(authorization: string) {

        try {
            if (!authorization) {
                throw CustomError.unauthorized('No token provided');
            }
            const token = authorization.split(' ')[1] || '';
            const payload = await jwtAdapter.verifyToken<{ id: string }>(token);

            if (!payload) {
                throw CustomError.unauthorized('Invalid token');
            }
            const user = await UserModel.findById(payload.id);
            if (!user) {
                throw CustomError.notFound('User not found');
            }
            const { password, ...userEntity } = UserEntity.fromObject(user);
            return userEntity;
        } catch (error) {
            return CustomError.unauthorized('Invalid token');
        }


    }
}