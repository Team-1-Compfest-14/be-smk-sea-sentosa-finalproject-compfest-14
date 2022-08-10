import { CourseEnrollment } from '../database/entities/CourseEnrollment';
import type {
    CourseEnrollmentInterface
} from '../validations/courseEnrollment.validate';
import { Errors } from '../utils/error.util';

class CourseEnrollmentService {

    async create(rawEnrollCourse: CourseEnrollmentInterface) {
        try {
            const enrollCourse = CourseEnrollment.create(
                { ...rawEnrollCourse });
            await CourseEnrollment.save(enrollCourse);
        } catch (error) {
            throw Errors.SERVER;
        }
    }

}

export const courseEnrollmentService = new CourseEnrollmentService();