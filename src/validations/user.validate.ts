import joi from 'joi';

export interface RegisterType {
    email: string;
    password: string;
    name: string;
    role: number;
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