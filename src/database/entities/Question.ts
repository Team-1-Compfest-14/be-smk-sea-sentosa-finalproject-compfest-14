import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { QuestionOption } from './QuestionOption';
import { Quiz } from './Quiz';
import { UsersAnswer } from './UsersAnswer';

@Entity('questions')
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'quiz_id' })
    quizId!: number;

    @Column({ length: 128 })
    question!: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @JoinColumn({ name: 'quiz_id' })
    quiz!: Quiz;

    @OneToMany(() => QuestionOption,
        (questionOption) => questionOption.question)
    questionOptions!: QuestionOption[];

    @OneToMany(() => UsersAnswer,
        (usersAnswer) => usersAnswer.question)
    usersAnswers!: UsersAnswer[];

}