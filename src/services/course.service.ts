import { Course } from '../database/entities/Course';
import type { AddCourseType } from '../validations/course.validate';

class CourseService {

    async add(instructorId: number, rawCourse: AddCourseType) {
        const course = Course.create({ instructorId, ...rawCourse });

        await Course.save(course);
    }

}

export const courseService = new CourseService();