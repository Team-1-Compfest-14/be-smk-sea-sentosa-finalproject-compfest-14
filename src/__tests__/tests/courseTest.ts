import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import {
    userInstructorVerifiedDataTest, userStudentDataTest
} from './userData';
import app from '../../app';

export const CourseInstructorTest = () => {
    let instructorToken: string;
    let studentToken: string;
    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userInstructorVerifiedDataTest.email,
                password: userInstructorVerifiedDataTest.password,
            });

        instructorToken = `Bearer ${response.body.data.accessToken}`;
    });

    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userStudentDataTest.email,
                password: userStudentDataTest.password,
            });

        studentToken = `Bearer ${response.body.data.accessToken}`;
    });

    describe('POST /courses', () => {
        it('should return CREATED IF form is valid ' +
        'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses')
                .set('Authorization', instructorToken)
                .send({
                    name: 'Test Course',
                    description: 'Test Course Description',
                });

            expect(response.status).toBe(StatusCodes.CREATED);
        });

        it('should return BAD REQUEST IF form is invalid ' +
        'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses')
                .set('Authorization', instructorToken)
                .send({
                    name: '',
                    description: 'Test Course Description',
                });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything(),
            });
        });

        it('should return UNAUTHORIZED IF not logged in as instructor',
            async () => {
                const response = await request(app)
                    .post('/courses')
                    .set('Authorization', studentToken)
                    .send({
                        name: 'Test Course',
                        description: 'Test Course Description',
                    });

                expect(response.status).toBe(StatusCodes.FORBIDDEN);
            });

        it('should return UNAUTHORIZED IF not logged in',
            async () => {
                const response = await request(app)
                    .post('/courses')
                    .send({
                        name: 'Test Course',
                        description: 'Test Course Description',
                    });

                expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything(),
                });
            });
    });
};