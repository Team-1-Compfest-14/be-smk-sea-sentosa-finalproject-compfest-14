import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../app';
import { userAdminDataTest, userStudentDataTest } from './userData';

export const ApprovalTest = () => {

    let adminToken: string;
    let studentToken: string;

    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userAdminDataTest.email,
                password: userAdminDataTest.password,
            });

        adminToken = `Bearer ${response.body.data.accessToken}`;
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

    describe('GET /approval/users', () => {
        it('should return OK IF logged in as admin', async () => {
            const response = await request(app)
                .get('/approval/users')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                data: expect.anything(),
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in', async () => {
            const response = await request(app)
                .get('/approval/users');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return FORBIDDEN IF not logged in as admin', async () => {
            const response = await request(app)
                .get('/approval/users')
                .set('Authorization', studentToken);

            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('GET /approval/courses', () => {
        it('should return OK IF logged in as admin', async () => {
            const response = await request(app)
                .get('/approval/courses')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                data: expect.anything(),
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in', async () => {
            const response = await request(app)
                .get('/approval/courses');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('POST /approval/users/:userId', () => {
        it('should return OK IF Instructor Approved', async () => {
            const response = await request(app)
                .post('/approval/users/3')
                .set('Authorization', adminToken)
                .send({
                    approved: true
                });

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return BAD_REQUEST IF Instructor' +
            ' already verified got Rejected', async () => {
            const response = await request(app)
                .post('/approval/users/3')
                .set('Authorization', adminToken)
                .send({
                    approved: false
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in', async () => {
            const response = await request(app)
                .post('/approval/users/3')
                .send({
                    approved: true
                });

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('POST /approval/courses/:courseId', () => {
        it('should return OK IF Course Approved', async () => {
            const response = await request(app)
                .post('/approval/courses/1')
                .set('Authorization', adminToken)
                .send({
                    approved: true
                });

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return BAD_REQUEST IF Course' +
            ' already verified got Rejected', async () => {
            const response = await request(app)
                .post('/approval/courses/1')
                .set('Authorization', adminToken)
                .send({
                    approved: false
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in as admin', async () => {
            const response = await request(app)
                .post('/approval/courses/1')
                .send({
                    approved: true
                });

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });
};