import joi from 'joi';

export interface CourseType {
    name: string;
    description: string;
}

export interface CourseIdType {
    courseId: number;
}

export interface CourseWithTotalType {
    id: number;
    instructorId: number;
    name: string;
    description: string;
    isVerified: boolean;
    total: number;
}

export interface DashboardCourseType {
    name: string;
    teacher: string;
    totalModule: number;
    totalModuleCompletion: number;
    courseId: number;
    isComplete: boolean;
}

export const courseSchema = joi.object<CourseType>({
    name: joi.string()
        .max(64)
        .required(),

    description: joi.string()
        .max(255)
        .required()
});

export const courseIdSchema = joi.object<CourseIdType>({
    courseId: joi.number()
        .required()
});