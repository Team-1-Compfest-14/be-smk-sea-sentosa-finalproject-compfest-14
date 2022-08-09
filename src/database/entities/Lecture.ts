import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Module } from './Module';

@Entity('lectures')
export class Lecture extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'module_id' })
    courseId!: number;

    @Column({ name: 'lecture_link', length: 64 })
    lectureLink!: string;

    @ManyToOne(() => Module, (module) => module.lectures)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

}