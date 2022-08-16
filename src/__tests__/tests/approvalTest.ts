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

    describe('GET /users/approval', () => {
        it('should return OK IF logged in as admin', async () => {
            const response = await request(app)
                .get('/approval/register')
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
                .get('/approval/register');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return FORBIDDEN IF not logged in', async () => {
            const response = await request(app)
                .get('/approval/register')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('GET /courses/approval', () => {
        it('should return OK IF logged in as admin', async () => {
            const response = await request(app)
                .get('/courses/approval')
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
                .get('/courses/approval');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('POST /approval/:instructorId', () => {
        it('should return OK IF Instructor Approved', async () => {
            const response = await request(app)
                .post('/approval/3?action=approve')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return FORBIDDEN IF Instructor' +
            ' already verified got Rejected', async () => {
            const response = await request(app)
                .post('/approval/3?action=reject')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in as admin', async () => {
            const response = await request(app)
                .post('/approval/3?action=approve');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });

    describe('POST /approval/course/:courseId', () => {
        it('should return OK IF Course Approved', async () => {
            const response = await request(app)
                .post('/approval/1?action=approve')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return FORBIDDEN IF Course' +
            ' already verified got Rejected', async () => {
            const response = await request(app)
                .post('/approval/1?action=reject')
                .set('Authorization', adminToken);

            expect(response.statusCode).toBe(StatusCodes.FORBIDDEN);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF not logged in as admin', async () => {
            const response = await request(app)
                .post('/approval/1?action=approve');

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });
};