import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import type {
    EnrollCourseInterface
} from '../validations/enrollCourse.validate';
import { Errors } from '../utils/error.util';

class EnrollCourseService {

    async create(rawEnrollCourse: EnrollCourseInterface) {
        try {
            const enrollCourse = CourseEnrollment.create(
                { ...rawEnrollCourse });
            await CourseEnrollment.save(enrollCourse);
        } catch (error) {
            throw Errors.SERVER;
        }
    }

}

export const enrollCourseService = new EnrollCourseService();