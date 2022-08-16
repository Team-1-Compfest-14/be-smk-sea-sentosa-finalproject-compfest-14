import { RegisterTest, LoginTest } from './tests/authTest';
import { ApprovalTest } from './tests/approvalTest';
import { QuestionInstructorTest } from './tests/quizTest';
import { CourseInstructorTest } from './tests/courseTest';

describe('Testing Auth Functions', () => {
    RegisterTest();
    LoginTest();
});

describe('Testing Admin Functions', () => {
    describe('Testing Approval Functions', () => {
        ApprovalTest();
    });
});

describe('Testing Instructor Functions', () => {
    describe('Testing Course Functions', () => {
        CourseInstructorTest();
    });

//     describe('Testing Question Functions', () => {
//         QuestionInstructorTest();
//     });
});