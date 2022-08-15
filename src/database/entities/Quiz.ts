import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Module } from './Module';
import { Question } from './Question';

@Entity('quizzes')
export class Quiz extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'module_id' })
    moduleId!: number;

    @OneToMany(() => Question, (question) => question.quiz)
    questions!: Question[];

    @OneToOne(() => Module)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

}