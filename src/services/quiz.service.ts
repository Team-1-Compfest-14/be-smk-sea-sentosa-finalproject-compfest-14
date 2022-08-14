import { StatusCodes } from 'http-status-codes';
import { Question } from '../database/entities/Question';
import { QuestionOption } from '../database/entities/QuestionOption';
import { UserRole } from '../database/entities/User';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import type {
    QuestionOptionType, QuizType
} from '../validations/quiz.validate';
import { courseService } from './course.service';
import { courseEnrollmentService } from './courseEnrollment.service';
import { moduleService } from './module.service';

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
        }

        if (course.instructorId !== userId) {
            throw Errors.NO_PERMISSION;
        }

        await moduleService.getQuiz(quizId);

        const questions = await Question.find({
            where: { quizId: quizId },
            relations: ['questionOptions'],
        });

        return questions;
    }

}

export const quizService = new QuizService();