import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Module } from './Module';

@Entity('lectures')
export class Lecture extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'module_id' })
    moduleId!: number;

    @Column({ name: 'lecture_link', length: 64 })
    lectureLink!: string;

    @OneToOne(() => Module)
    @JoinColumn({ name: 'module_id' })
    module!: Module;

}