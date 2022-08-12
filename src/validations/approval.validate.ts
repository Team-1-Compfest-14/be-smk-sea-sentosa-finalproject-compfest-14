import joi from 'joi';

export interface ApprovalType {
    id: number;
}

export interface ApprovalQueryType {
    action: string;
}

export const approvalSchema = joi.object<ApprovalType>({
    id: joi.number()
        .required()
});

export const approvalQuerySchema = joi.object<ApprovalQueryType>({
    action: joi.string()
        .max(10)
        .required()
});