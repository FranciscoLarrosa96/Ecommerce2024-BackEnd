import { CustomError } from "../errors/custom.error";


export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly emailVerified: boolean,
        public readonly password: string,
        public readonly role: string[],
        public readonly img?: string,
    ) { }

    static fromObject(user: { [key: string]: any }) {
        const {
            id,
            _id,
            name,
            email,
            emailVerified,
            password,
            role,
            img
        } = user;

        if (!id && !_id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!name) {
            throw CustomError.badRequest('Missing name');
        }

        if (!email) {
            throw CustomError.badRequest('Missing email');
        }

        if (emailVerified === undefined) {
            throw CustomError.badRequest('Missing emailVerified');
        }

        if(!password) {
            throw CustomError.badRequest('Missing password');
        }

        if(!role) {
            throw CustomError.badRequest('Missing role');
        }

        return new UserEntity(_id || id, name, email, emailVerified, password, role, img);
    }
}