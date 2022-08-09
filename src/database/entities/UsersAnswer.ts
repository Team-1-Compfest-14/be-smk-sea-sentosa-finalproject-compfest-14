import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Question } from './Question';
import { QuestionOption } from './QuestionOption';
import { User } from './User';

@Entity('users_answers')
export class UsersAnswer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'question_id' })
    questionId!: number;

    @Column({ name: 'user_id' })
    userId!: number;

    @Column({ name: 'question_option_id' })
    questionOptionId!: number;

    @ManyToOne(() => Question, (question) => question.usersAnswers)
    @JoinColumn({ name: 'question_id' })
    question!: Question;

    @ManyToOne(() => User, (user) => user.usersAnswers)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => QuestionOption,
        (questionOption) => questionOption.usersAnswers)
    @JoinColumn({ name: 'question_option_id' })
    questionOption!: QuestionOption;

}