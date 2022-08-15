import joi from 'joi';

export interface ApprovalInstructorType {
    userId: number;
}

export interface ApprovalCourseType {
    courseId: number;
}

export interface ApprovalType {
    approved: boolean;
}

export const approvalInstructorSchema = joi.object<ApprovalInstructorType>({
    userId: joi.number()
        .required()
});

export const approvalCourseSchema = joi.object<ApprovalCourseType>({
    courseId: joi.number()
        .required()
});

export const ApprovalSchema = joi.object<ApprovalType>({
    approved: joi.boolean()
        .required()
});
