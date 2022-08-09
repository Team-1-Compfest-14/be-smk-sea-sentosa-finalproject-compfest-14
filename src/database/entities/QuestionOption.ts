import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Question } from './Question';
import { UsersAnswer } from './UsersAnswer';

@Entity('question_options')
export class QuestionOption extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'question_id' })
    questionId!: number;

    @Column({ length: 64 })
    option!: string;

    @Column({ name: 'is_correct_answer', default: false })
    isCorrectAnswer!: boolean;

    @ManyToOne(() => Question, (question) => question.questionOptions)
    @JoinColumn({ name: 'question_id' })
    question!: Question;

    @OneToMany(() => UsersAnswer,
        (usersAnswer) => usersAnswer.questionOption)
    usersAnswers!: UsersAnswer[];

}