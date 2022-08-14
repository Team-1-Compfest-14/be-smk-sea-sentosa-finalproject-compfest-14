import { Question } from '../database/entities/Question';
import { QuestionOption } from '../database/entities/QuestionOption';
import type { UserPayload } from '../typings/auth';
import { Errors } from '../utils/error.util';
import type {
    questionOptionType, quizType
} from '../validations/quiz.validate';
import { courseService } from './course.service';
import { moduleService } from './module.service';

class QuizService {

    async addNewQuestion(
        courseId: number,
        quizId: number,
        userId: UserPayload['userId'],
        rawQuestion: quizType) {

        const course = await courseService.get(courseId);

        if (course.instructorId !== userId) {
            throw Errors.NO_PERMISSION;
        }

        await moduleService.getQuiz(quizId);

        const questionData = {
            quizId: quizId,
            question: rawQuestion.question,
        };

        const answersData: questionOptionType[] =
            rawQuestion.questionOptions;

        const questionSave = Question.create({ ...questionData });
        const question = await Question.save(questionSave);

        const questionId = question.id;

        answersData.map(async (answer: questionOptionType) => {
            const answerData = {
                questionId,
                option: answer.option,
                isCorrectAnswer: answer.isCorrectAnswer,
            };

            const answerSave = QuestionOption.create({ ...answerData });
            await QuestionOption.save(answerSave);
        });
    }

}

export const quizService = new QuizService();