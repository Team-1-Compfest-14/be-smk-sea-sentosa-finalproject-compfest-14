import { UserRole } from '../../../src/database/entities/User';

interface UserDataTestInterface {
    email: string;
    password: string;
    name: string;
    role: number;
}

export const userStudentDataTest: UserDataTestInterface = {
    email: 'student-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa',
    role: UserRole.STUDENT
};

export const userInstructorNotVerifiedDataTest: UserDataTestInterface = {
    email: 'instructor-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa Instructor',
    role: UserRole.INSTRUCTOR
};

export const userInstructorVerifiedDataTest: UserDataTestInterface = {
    email: 'instructor1@gmail.com',
    password: 'instructor123',
    name: 'Instructor 1',
    role: UserRole.INSTRUCTOR
};

export const userAdminDataTest: UserDataTestInterface = {
    email: 'admin@gmail.com',
    password: 'admin123',
    name: 'Admin',
    role: UserRole.ADMIN
};