import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../app';

export const RegisterTest = () => {
    describe('POST /auth/register', () => {
        it('should return CREATED IF all form fields passed.', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'sea-sentosa@gmail.com',
                    password: '123456',
                    name: 'Sea Sentosa',
                    role: 0,
                });

            expect(response.statusCode).toBe(StatusCodes.CREATED);
        });

        it('should return BAD REQUEST IF email already registed.', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'sea-sentosa@gmail.com',
                    password: '123456',
                    name: 'Sea Sentosa',
                    role: 0,
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });

        it('should return BAD REQUEST IF forms field not filled.', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: '',
                    password: '',
                    name: 'Sea Sentosa',
                    role: 0,
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
    });
};

export const LoginTest = () => {
    describe('POST /auth/login', () => {
        it('should return OK IF all form fields passed.', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'sea-sentosa@gmail.com',
                    password: '123456',
                });
            expect(response.statusCode).toBe(StatusCodes.OK);
        });

        it('should return BAD REQUEST IF email not registed.', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'sea@gmail.com',
                    password: '123456',
                });
            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });

        it('should return BAD REQUEST IF password not match.', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'sea-sentosa@gmail.com',
                    password: '12345',
                });
            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });

        it('should return BAD REQUEST IF forms field not filled.', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: '',
                    password: '',
                });
            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
    });
};