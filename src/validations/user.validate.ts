import joi from 'joi';

export interface RegisterType extends LoginType {
    name: string;
    role: number;
}

export interface LoginType {
    email: string;
    password: string;
}

export interface UserIdType {
    userId: number;
}

export const registerSchema = joi.object<RegisterType>({
    email: joi.string()
        .email()
        .max(64)
        .required(),

    password: joi.string()
        .max(64)
        .required(),

    name: joi.string()
        .max(64)
        .required(),

    role: joi.number()
        .required()
});

export const loginSchema = joi.object<LoginType>({
    email: joi.string()
        .email()
        .max(64)
        .required(),

    password: joi.string()
        .max(64)
        .required()
});

export const userIdSchema = joi.object<UserIdType>({
    userId: joi.number()
        .required()
});