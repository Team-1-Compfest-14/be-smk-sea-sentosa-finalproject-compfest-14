import { StatusCodes } from 'http-status-codes';
import { Module } from '../database/entities/Module';
import { Question } from '../database/entities/Question';
import { QuestionOption } from '../database/entities/QuestionOption';
import { Quiz } from '../database/entities/Quiz';
import { UserRole } from '../database/entities/User';
import { UsersAnswer } from '../database/entities/UsersAnswer';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import type {
    AddUserAnswerType,
    QuestionOptionType, QuizType
} from '../validations/quiz.validate';
import { courseService } from './course.service';
import { courseEnrollmentService } from './courseEnrollment.service';
import { moduleService } from './module.service';

interface feedbackInterface {
    questionId: number;
    questionOptionId: number;
    correct: boolean;
}

interface feedbackAnswersInterface {
    totalQuestions: number;
    correctAnswers: number;
    feedback: feedbackInterface[];
}

class QuizService {

    async addNewQuestion(
        courseId: number,
        quizId: number,
        userId: number,
        rawQuestion: QuizType) {

        if (rawQuestion.questionOptions.length < 2) {
            throw new ResponseError(
                'Question must have at least two option.',
                StatusCodes.BAD_REQUEST,
            );
        }

        const course = await courseService.get(courseId);

        if (course.instructorId !== userId) {
            throw Errors.NO_PERMISSION;
        }

        await moduleService.getQuiz(quizId);

        const questionData = {
            quizId: quizId,
            question: rawQuestion.question,
        };

        const questionOptions: QuestionOptionType[] =
            rawQuestion.questionOptions;

        const questionSave = Question.create({ ...questionData });
        const question = await Question.save(questionSave);

        const questionId = question.id;

        questionOptions.map(async (answer: QuestionOptionType) => {
            const options = {
                questionId,
                option: answer.option,
                isCorrectAnswer: answer.isCorrectAnswer,
            };

            const answerSave = QuestionOption.create({ ...options });
            await QuestionOption.save(answerSave);
        });
    }

    async ViewAllQuestionsAndOptions(
        courseId: number,
        quizId: number,
        { userId, role }: UserPayload) {

        const course = await courseService.get(courseId);

        if (role === UserRole.STUDENT) {
            await courseEnrollmentService
                .getCourseEnrollment(courseId, userId);
        } else {
            if (course.instructorId !== userId) {
                throw Errors.NO_PERMISSION;
            }
        }

        await moduleService.getQuiz(quizId);

        const questions = await Question.find({
            where: { quizId: quizId },
            relations: ['questionOptions'],
        });

        return questions;
    }

    async addUserAnswer(
        courseId: number,
        quizId: number,
        { userId, role }: UserPayload,
        rawAnswer: AddUserAnswerType,) {

        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        await courseEnrollmentService
            .getCourseEnrollment(courseId, userId);

        const quiz = await moduleService.getQuiz(quizId);

        if (quiz) {
            const quizQuestions = quiz.questions.length;
            if (rawAnswer.answers.length !== quizQuestions) {
                throw new ResponseError(
                    'Number of answers must be equal to number of questions.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const isCompleted = await moduleService
                .isModuleCompleted(userId, quiz.moduleId);

            if (isCompleted) {
                throw new ResponseError(
                    'Module already completed.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            rawAnswer.answers.map(async (answer) => {
                const userAnswer = {
                    questionId: answer.questionId,
                    userId: userId,
                    questionOptionId: answer.questionOptionId,
                };

                const answerSave = UsersAnswer.create({ ...userAnswer });
                await UsersAnswer.save(answerSave);
            });

            await moduleService.addModuleCompleted(
                userId,
                quiz.moduleId,
            );
        }

    }

    async getQuestionAndOptions(
        questionId: number) {

        const question = await Question.findOne({
            where: { id: questionId },
            relations: ['questionOptions'],
        });

        if (!question) {
            throw new ResponseError(
                'Question not found.',
                StatusCodes.NOT_FOUND,
            );
        }

        return question;

    }

    async feedbackAnswers(
        courseId: number,
        quizId: number,
        { userId, role }: UserPayload
    ) {
        if (role !== UserRole.STUDENT) {
            throw Errors.NO_PERMISSION;
        }

        await courseEnrollmentService
            .getCourseEnrollment(courseId, userId);

        const quiz = await moduleService.getQuiz(quizId);

        if (quiz) {
            const isCompleted = await moduleService
                .isModuleCompleted(userId, quiz.moduleId);

            if (!isCompleted) {
                throw new ResponseError(
                    'Module not completed.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const quizQuestions = quiz.questions.length;
            const userAnswers = await UsersAnswer.find({
                where: { userId: userId },
                relations: ['questionOption'],
            });

            if (userAnswers.length !== quizQuestions) {
                throw new ResponseError(
                    'Number of answers must be equal to number of questions.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const tempFeedback: feedbackInterface[] = [];

            quiz.questions.map(async (question) => {
                const userAnswer = userAnswers.find(
                    (answer) => answer.questionId === question.id,
                );

                if (userAnswer) {
                    tempFeedback.push({
                        questionId: question.id,
                        questionOptionId: userAnswer.questionOptionId,
                        correct: userAnswer.questionOption.isCorrectAnswer,
                    });
                }
            });

            const feedback: feedbackAnswersInterface = {
                totalQuestions: quiz.questions.length,
                correctAnswers: tempFeedback.filter(
                    (answer) => answer.correct === true,
                ).length,
                feedback: tempFeedback,
            };

            return feedback;
        }

    }

    async deleteQuiz({ userId, role }: UserPayload,
        courseId: number, quizId: number) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const quiz = await Quiz.findOneBy({ id: quizId });
        if (!quiz) {
            throw new ResponseError('Cannot find quiz', StatusCodes.NOT_FOUND);
        }

        const module = await Module.findOneBy({ id: quiz.moduleId });
        if (!module) {
            throw Errors.MODULE_NOT_FOUND;
        }

        await Module.remove(module);
    }

}

export const quizService = new QuizService();