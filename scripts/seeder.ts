import { Module, ModuleType } from '../src/database/entities/Module';
import { Course } from '../src/database/entities/Course';
import { CourseEnrollment } from '../src/database/entities/CourseEnrollment';
import { User, UserRole } from '../src/database/entities/User';
import { authService } from '../src/services/auth.service';
import { AppDataSource } from '../src/database/data-source';
import { Lecture } from '../src/database/entities/Lecture';
import { Quiz } from '../src/database/entities/Quiz';

async function seedData() {
    const { hashPassword } = authService;

    const users: User[] = [
        User.create({
            email: 'admin@gmail.com',
            password: await hashPassword('admin123'),
            name: 'Admin',
            role: UserRole.ADMIN,
            isVerified: true
        }),
        User.create({
            email: 'student1@gmail.com',
            password: await hashPassword('student123'),
            name: 'Student 1',
            role: UserRole.STUDENT,
            isVerified: true
        }),
        User.create({
            email: 'student2@gmail.com',
            password: await hashPassword('student123'),
            name: 'Student 2',
            role: UserRole.STUDENT,
            isVerified: true
        }),
        User.create({
            email: 'instructor1@gmail.com',
            password: await hashPassword('instructor123'),
            name: 'Instructor 1',
            role: UserRole.INSTRUCTOR,
            isVerified: true
        }),
        User.create({
            email: 'instructor2@gmail.com',
            password: await hashPassword('instructor123'),
            name: 'Instructor 2',
            role: UserRole.INSTRUCTOR,
            isVerified: true
        }),
        User.create({
            email: 'instructor3@gmail.com',
            password: await hashPassword('instructor123'),
            name: 'Instructor 3',
            role: UserRole.INSTRUCTOR
        }),
        User.create({
            email: 'instructor4@gmail.com',
            password: await hashPassword('instructor123'),
            name: 'Instructor 4',
            role: UserRole.INSTRUCTOR
        })
    ];
    await User.save(users);

    const courses: Course[] = [
        Course.create({
            instructorId: 4,
            name: 'Introduction to Backend',
            description: 'Lorem ipsum dolor sit consectetur adipisicing elit.',
            isVerified: true
        }),
        Course.create({
            instructorId: 5,
            name: 'Introduction to Frontend',
            description: 'Lorem ipsum dolor sit consectetur adipisicing elit.',
            isVerified: true
        }),
        Course.create({
            instructorId: 5,
            name: 'Introduction to UI/UX',
            description: 'Lorem ipsum dolor sit consectetur adipisicing elit.'
        })
    ];
    await Course.save(courses);

    const courseEnrollments: CourseEnrollment[] = [
        CourseEnrollment.create({
            userId: 2,
            courseId: 1
        }),
        CourseEnrollment.create({
            userId: 2,
            courseId: 2
        })
    ];
    await CourseEnrollment.save(courseEnrollments);

    const modules: Module[] = [
        Module.create({
            courseId: 1,
            order: 1,
            name: 'Lecture 1',
            type: ModuleType.LECTURE
        }),
        Module.create({
            courseId: 1,
            order: 2,
            name: 'Lecture 2',
            type: ModuleType.LECTURE
        }),
        Module.create({
            courseId: 1,
            order: 1,
            name: 'Quiz 1',
            type: ModuleType.QUIZ
        }),
        Module.create({
            courseId: 1,
            order: 2,
            name: 'Quiz 2',
            type: ModuleType.QUIZ
        }),
        Module.create({
            courseId: 2,
            order: 1,
            name: 'Quiz 1',
            type: ModuleType.QUIZ
        }),
        Module.create({
            courseId: 2,
            order: 1,
            name: 'Lecture 1',
            type: ModuleType.LECTURE
        })
    ];
    await Module.save(modules);

    const lectures: Lecture[] = [
        Lecture.create({
            moduleId: 1,
            lectureLink: 'https://www.youtube.com/watch?v=mywS9-Ov1_I'
        }),
        Lecture.create({
            moduleId: 2,
            lectureLink: 'https://www.youtube.com/watch?v=mywS9-Ov1_I'
        }),
        Lecture.create({
            moduleId: 6,
            lectureLink: 'https://www.youtube.com/watch?v=mywS9-Ov1_I'
        })
    ];
    await Lecture.save(lectures);

    const quizzes: Quiz[] = [
        Quiz.create({
            moduleId: 3
        }),
        Quiz.create({
            moduleId: 4
        }),
        Quiz.create({
            moduleId: 5
        })
    ];
    await Quiz.save(quizzes);
}

AppDataSource.initialize()
    .then(async () => {
        await seedData();

        console.log('Data seeding has finished!');
        process.exit();
    })
    .catch((err: Error) => console.log(`${err} ${err.stack}`));