import { RegisterTest, LoginTest } from './tests/authTest';
import { ApprovalTest } from './tests/approvalTest';

describe('Testing Auth Functions', () => {
    RegisterTest();
    LoginTest();
});

describe('Testing Admin Functions', () => {
    ApprovalTest();
});