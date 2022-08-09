import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Module } from './Module';

@Entity('quizzes')
export class Quiz extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'module_id' })
    courseId!: number;

    @ManyToOne(() => Module, (module) => module.quizzes)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

}