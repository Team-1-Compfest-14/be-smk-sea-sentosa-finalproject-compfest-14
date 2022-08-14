import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { userInstructorVerifiedDataTest } from './userData';
import app from '../../app';

export const QuestionInstructorTest = () => {
    let token: string;
    const exampleQuestion = {
        question: 'What is the capital of Indonesia?',
        questionOptions: [
            {
                option: 'Jakarta',
                isCorrectAnswer: true
            },
            {
                option: 'Bandung',
                isCorrectAnswer: false
            },
            {
                option: 'Surabaya',
                isCorrectAnswer: false
            },
            {
                option: 'Malang',
                isCorrectAnswer: false
            }
        ]
    };

    beforeAll(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: userInstructorVerifiedDataTest.email,
                password: userInstructorVerifiedDataTest.password,
            });

        token = `Bearer ${response.body.data.accessToken}`;
    });

    describe('POST /courses/:courseId/modules/quizzes', () => {
        it('should return CREATED IF form is valid ' +
        'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses/1/modules/quizzes')
                .set('Authorization', token)
                .send({
                    name: 'Test Quiz',
                    order: 10,
                });

            expect(response.status).toBe(StatusCodes.CREATED);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return BAD_REQUEST IF form is invalid ' +
        'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses/1/modules/quizzes')
                .set('Authorization', token)
                .send({
                    name: '',
                    order: 10,
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
                    .post('/courses/1/modules/quizzes')
                    .set('Authorization', 'Bearer invalid_token');

                expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything(),
                });
            });

        it('should return UNAUTHORIZED IF not logged in',
            async () => {
                const response = await request(app)
                    .post('/courses/1/modules/quizzes');

                expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything(),
                });
            });

        it('should return BAD REQUEST IF courseId is not number',
            async () => {
                const response = await request(app)
                    .post('/courses/invalid_id/modules/quizzes')
                    .set('Authorization', token)
                    .send({
                        name: 'Test Quiz',
                        order: 10,
                    });
                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything(),
                });
            });

        it('should return NOT_FOUND IF courseId is invalid',
            async () => {
                const response = await request(app)
                    .post('/courses/100/modules/quizzes')
                    .set('Authorization', token)
                    .send({
                        name: 'Test Quiz',
                        order: 10,
                    });
                expect(response.status).toBe(StatusCodes.NOT_FOUND);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything(),
                });
            });
    });

    describe('POST /courses/:courseId/quizzes/:quizId/questions', () => {
        it('should return CREATED IF form is valid ' +
            'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses/1/quizzes/1/questions')
                .set('Authorization', token)
                .send(exampleQuestion);

            expect(response.statusCode).toBe(StatusCodes.CREATED);
            expect(response.body).toMatchObject({
                status: 'success',
                message: expect.anything()
            });
        });

        it('should return UNAUTHORIZED IF form is valid ' +
            'and logged in as instructor', async () => {
            const response = await request(app)
                .post('/courses/1/quizzes/1/questions')
                .send(exampleQuestion);

            expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return BAD REQUEST IF courseId is not a number',
            async () => {
                const response = await request(app)
                    .post('/courses/a/quizzes/1/questions')
                    .set('Authorization', token)
                    .send(exampleQuestion);

                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything()
                });
            });

        it('should return BAD REQUEST IF quizId is not a number',
            async () => {
                const response = await request(app)
                    .post('/courses/1/quizzes/a/questions')
                    .set('Authorization', token)
                    .send(exampleQuestion);

                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything()
                });
            });

        it('should return BAD REQUEST IF question is not provided',
            async () => {
                const response = await request(app)
                    .post('/courses/1/quizzes/1/questions')
                    .set('Authorization', token)
                    .send({
                        question: '',
                        questionOptions: exampleQuestion.questionOptions
                    });

                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything()
                });
            });

        it('should return BAD REQUEST IF questionOptions is not provided',
            async () => {
                const response = await request(app)
                    .post('/courses/1/quizzes/1/questions')
                    .set('Authorization', token)
                    .send({
                        question: exampleQuestion.question,
                        questionOptions: []
                    });

                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything()
                });
            });

        it('should return BAD REQUEST IF questionOptions ' +
        'length is not more than 1', async () => {
            const response = await request(app)
                .post('/courses/1/quizzes/1/questions')
                .set('Authorization', token)
                .send({
                    question: exampleQuestion.question,
                    questionOptions: [
                        {
                            option: 'Jakarta',
                            isCorrectAnswer: true
                        }
                    ]
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return BAD REQUEST IF questionOptions is not an array',
            async () => {
                const response = await request(app)
                    .post('/courses/1/quizzes/1/questions')
                    .set('Authorization', token)
                    .send({
                        question: exampleQuestion.question,
                        questionOptions: 'a'
                    });

                expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
                expect(response.body).toMatchObject({
                    status: 'fail',
                    message: expect.anything()
                });
            });

        it('should return BAD REQUEST IF questionOptions ' +
            'is not an array of objects', async () => {
            const response = await request(app)
                .post('/courses/1/quizzes/1/questions')
                .set('Authorization', token)
                .send({
                    question: exampleQuestion.question,
                    questionOptions: [
                        'a',
                        'b',
                        'c',
                        'd'
                    ]
                });

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return BAD REQUEST IF quizId not found', async () => {
            const response = await request(app)
                .post('/courses/1/quizzes/100/questions')
                .set('Authorization', token)
                .send(exampleQuestion);

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });

        it('should return NOT FOUND IF courseId not found', async () => {
            const response = await request(app)
                .post('/courses/100/quizzes/1/questions')
                .set('Authorization', token)
                .send(exampleQuestion);

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(response.body).toMatchObject({
                status: 'fail',
                message: expect.anything()
            });
        });
    });
};