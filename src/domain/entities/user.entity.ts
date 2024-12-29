import { CustomError } from "../errors/custom.error";


export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly emailVerified: boolean,
        public readonly password: string,
        public readonly role: string[],
        public readonly img: string,
        public readonly googleUser?: boolean,
    ) { }

    static fromObject(user: { [key: string]: any }) {
        const {
            id,
            _id,
            name,
            lastName,
            email,
            emailVerified,
            password,
            role,
            img,
            googleUser
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

        if (!password) {
            throw CustomError.badRequest('Missing password');
        }

        return new UserEntity(_id || id, name, lastName, email, emailVerified, password, role, img, googleUser);
    }
}