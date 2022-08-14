import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { userInstructorVerifiedDataTest } from './userData';
import app from '../../app';

export const CourseInstructorTest = () => {
    let token: string;
    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userInstructorVerifiedDataTest.email,
                password: userInstructorVerifiedDataTest.password,
            });

        token = `Bearer ${response.body.data.accessToken}`;
    });

    describe('POST /courses', () => {
        it('should return CREATED IF form is valid ' +
        'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses')
                .set('Authorization', token)
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
                .set('Authorization', token)
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
                    .set('Authorization', 'Bearer invalid_token')
                    .send({
                        name: 'Test Course',
                        description: 'Test Course Description',
                    });

                expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
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