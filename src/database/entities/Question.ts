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

}