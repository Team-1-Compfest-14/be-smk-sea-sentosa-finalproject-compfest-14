import joi from 'joi';

export interface ApprovalType {
    id: number;
}

export const approvalSchema = joi.object<ApprovalType>({
    id: joi.number()
        .required()
});