import { RegisterTest, LoginTest } from './tests/authTest';
import { ApprovalTest } from './tests/approvalTest';
import { QuizInstructorTest } from './tests/quizTest';

describe('Testing Auth Functions', () => {
    RegisterTest();
    LoginTest();
});

describe('Testing Admin Functions', () => {
    ApprovalTest();
});

describe('Testing Instructor Functions', () => {
    QuizInstructorTest();
});