import joi from 'joi';
import type { ActionType } from '../typings/action';

export interface ApprovalInstructorType {
    userId: number;
}

export interface ApprovalCourseType {
    courseId: number;
}

export interface ApprovalQueryType {
    action: ActionType;
}

export const approvalInstructorSchema = joi.object<ApprovalInstructorType>({
    userId: joi.number()
        .required()
});

export const approvalCourseSchema = joi.object<ApprovalCourseType>({
    courseId: joi.number()
        .required()
});

export const approvalQuerySchema = joi.object<ApprovalQueryType>({
    action: joi.string()
        .max(10)
        .required()
});
