import { Course } from '../database/entities/Course';
import type { AddCourseType } from '../validations/course.validate';
import { userService } from './user.service';

class CourseService {

    async add(instructorId: number, rawCourse: AddCourseType) {
        const user = await userService.get(instructorId);
        const course = Course.create({ instructorId: user.id, ...rawCourse });

        await Course.save(course);
    }

}

export const courseService = new CourseService();