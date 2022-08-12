import joi from 'joi';
import type { ActionType } from '../typings/action';

export interface ApprovalType {
    userId: number;
}

export interface ApprovalQueryType {
    action: ActionType;
}

export const approvalSchema = joi.object<ApprovalType>({
    userId: joi.number()
        .required()
});

export const approvalQuerySchema = joi.object<ApprovalQueryType>({
    action: joi.string()
        .max(10)
        .required()
});