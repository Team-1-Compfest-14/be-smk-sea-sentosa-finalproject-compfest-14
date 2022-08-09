import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Quiz } from './Quiz';

@Entity('questions')
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'quiz_id' })
    quizId!: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    @JoinColumn({ name: 'quiz_id' })
    quiz!: Quiz;

}