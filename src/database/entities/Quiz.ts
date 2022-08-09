import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
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

    @ManyToOne(() => Module, (module) => module.quizzes)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

    @OneToMany(() => Question, (question) => question.quiz)
    questions!: Question[];

}