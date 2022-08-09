import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';

@Entity('courses')
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.courses)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ length: 64 })
    name!: string;

    @Column({ length: 128 })
    description!: string;

    @Column()
    is_verified!: boolean;

}