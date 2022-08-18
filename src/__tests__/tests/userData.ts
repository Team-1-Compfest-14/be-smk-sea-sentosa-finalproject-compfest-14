import { UserRole } from '../../../src/database/entities/User';

interface User {
    email: string;
    password: string;
    name: string;
    role: number;
}

export const userStudentDataTest: User = {
    email: 'student-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa',
    role: UserRole.STUDENT
};

export const userInstructorNotVerifiedDataTest: User = {
    email: 'instructor-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa Instructor',
    role: UserRole.INSTRUCTOR
};

export const userInstructorVerifiedDataTest: User = {
    email: 'instructor1@gmail.com',
    password: 'instructor123',
    name: 'Instructor 1',
    role: UserRole.INSTRUCTOR
};

export const userAdminDataTest: User = {
    email: 'admin@gmail.com',
    password: 'admin123',
    name: 'Admin',
    role: UserRole.ADMIN
};