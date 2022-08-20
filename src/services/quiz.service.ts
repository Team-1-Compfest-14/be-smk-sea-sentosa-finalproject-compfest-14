import { Course } from '../database/entities/Course';
import { StatusCodes } from 'http-status-codes';
import { In } from 'typeorm';
import { Module, ModuleType } from '../database/entities/Module';
import { Question } from '../database/entities/Question';
import { QuestionOption } from '../database/entities/QuestionOption';
import { Quiz } from '../database/entities/Quiz';
import { UserRole } from '../database/entities/User';
import { UsersAnswer } from '../database/entities/UsersAnswer';
import type { UserPayload } from '../typings/auth';
import { Errors, ResponseError } from '../utils/error.util';
import type { CourseIdType } from '../validations/course.validate';
import type {
    AddQuizType,
    AddUserAnswerType,
    DeleteQuestionParamsType,
    EditQuizNameType,
    QuestionOptionType, QuizParamType, QuizType
} from '../validations/quiz.validate';
import { courseService } from './course.service';
import { courseEnrollmentService } from './courseEnrollment.service';
import { moduleService } from './module.service';

interface feedbackInterface {
    id: number;
    question: string;
    questionOptions: questionOptionsInterface[];
    isCorrect: boolean;
}

interface questionOptionsInterface {
    id: number;
    option: string;
    isUserAnswer: boolean;
    isQuestionAnswer: boolean;
}

class QuizService {

    async addQuiz(
        { userId, role }: UserPayload,
        { courseId }: CourseIdType,
        { name }: AddQuizType) {

        const course = await Course.findOneBy(
            { id: courseId, isVerified: true });
        if (!course) {
            throw Errors.COURSE_NOT_FOUND;
        }

        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const module = await moduleService.add(courseId, name, ModuleType.QUIZ);

        const quiz = Quiz.create({ moduleId: module.id });
        await Quiz.save(quiz);
    }

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

    async ViewAllQuestionsAndOptionsForStudent(
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

        const quiz = await moduleService.getQuiz(quizId);

        const isCompleted = await moduleService
            .isModuleCompleted(userId, quiz.moduleId);

        if (isCompleted) {
            throw new ResponseError(
                'Quiz already completed.',
                StatusCodes.BAD_REQUEST,
            );
        }

        const questions = await Question.findBy({ quizId });
        for (const question of questions) {
            const questionOptions = await QuestionOption
                .createQueryBuilder('questionOption')
                .leftJoinAndSelect('questionOption.question', 'question')
                .andWhere('question.id = :questionId',
                    { questionId: question.id })
                .select([
                    'questionOption.id',
                    'questionOption.questionId',
                    'questionOption.option'
                ])
                .getMany();
            question.questionOptions = questionOptions;
        }

        const questionsData = {
            quizName: quiz.module.name,
            questions
        };

        return questionsData;
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
                    'Quiz already completed.',
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

        const questions = await Question.find({
            where: { quizId: quizId },
            relations: ['questionOptions', 'quiz'],
        });

        if (questions) {
            const quiz = questions[0].quiz;
            const isCompleted = await moduleService
                .isModuleCompleted(userId, quiz.moduleId);

            if (!isCompleted) {
                throw new ResponseError(
                    'Module not completed.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const quizQuestions = questions.length;
            const userAnswers = await UsersAnswer.find({
                where: {
                    userId: userId,
                    questionId:
                        In(questions.map((question) => question.id))
                },
                relations: ['questionOption'],
            });

            if (userAnswers.length !== quizQuestions || !userAnswers) {
                throw new ResponseError(
                    'Number of answers must be equal to number of questions.',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const tempFeedback: feedbackInterface[] = [];
            const quizData = await moduleService.getQuiz(quizId);

            questions.map((question) => {
                const tempOption: questionOptionsInterface[] = [];
                question.questionOptions.map((option) => {
                    const isUserAnswer =
                        userAnswers.map((answer) => answer.questionOption.id)
                            .includes(option.id);
                    tempOption.push({
                        id: option.id,
                        option: option.option,
                        isUserAnswer,
                        isQuestionAnswer: option.isCorrectAnswer,
                    });
                });

                const feedback = {
                    id: question.id,
                    question: question.question,
                    questionOptions: tempOption,
                    isCorrect: tempOption.every(
                        (option) =>
                            option.isQuestionAnswer === option.isUserAnswer),
                };

                tempFeedback.push(feedback);

            });
            const questionsData = {
                quizName: quizData.module.name,
                questions: tempFeedback
            };
            return questionsData;
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

    async editQuizName({ userId, role }: UserPayload,
        { courseId, quizId }: QuizParamType,
        { name }: EditQuizNameType) {

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

        module.name = name ?? module.name;
        await Module.save(module);
    }

    async getAllQuizzesForInstructor(
        { userId, role }: UserPayload, { courseId }: CourseIdType) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const quizzes = await Module.find({
            where: { courseId, type: ModuleType.QUIZ },
            relations: {
                quiz: true
            }
        });

        return quizzes;
    }

    async deleteQuestion({ userId, role }: UserPayload,
        { courseId, quizId, questionId }: DeleteQuestionParamsType) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const quiz = await Quiz.findOneBy({ id: quizId });
        if (!quiz) {
            throw new ResponseError('Quiz not found', StatusCodes.NOT_FOUND);
        }

        const question = await Question.findOneBy({ id: questionId });
        if (!question) {
            throw new ResponseError(
                'Question not found', StatusCodes.NOT_FOUND);
        }

        await Question.remove(question);
    }

    async ViewAllQuestionsAndOptionsForInstructor({ userId, role }: UserPayload,
        { courseId, quizId }: QuizParamType) {

        const course = await courseService.get(courseId);
        if (course.instructorId !== userId || role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const quiz = await Quiz.findOneBy({ id: quizId });
        if (!quiz) {
            throw new ResponseError('Quiz not found', StatusCodes.NOT_FOUND);
        }

        const questions = await Question.find({
            where: { quizId },
            relations: {
                questionOptions: true
            }
        });

        return questions;
    }

}

export const quizService = new QuizService();