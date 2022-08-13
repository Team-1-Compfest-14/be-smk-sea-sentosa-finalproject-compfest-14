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
    role: 0
};

export const userInstructorDataTest: UserDataTestInterface = {
    email: 'instructor-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa Instructor',
    role: 1
};

export const userAdminDataTest: UserDataTestInterface = {
    email: 'admin-sea-sentosa@gmail.com',
    password: '123456',
    name: 'Sea Sentosa Admin',
    role: 2
};