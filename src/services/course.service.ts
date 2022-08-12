import { Course } from '../database/entities/Course';
import { UserRole } from '../database/entities/User';
import { Errors } from '../utils/error.util';
import type { AddCourseType } from '../validations/course.validate';
import { userService } from './user.service';

class CourseService {

    async add(instructorId: number, rawCourse: AddCourseType) {
        const user = await userService.get(instructorId);
        if (user.role !== UserRole.INSTRUCTOR) {
            throw Errors.NO_PERMISSION;
        }

        const course = Course.create({ instructorId, ...rawCourse });

        await Course.save(course);
    }

}

export const courseService = new CourseService();