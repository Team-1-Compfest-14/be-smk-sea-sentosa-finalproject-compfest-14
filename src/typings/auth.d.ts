import type { UserRole } from '../database/entities/User';

export type TokenType = 'ACCESS' | 'REFRESH';

export interface UserPayload {
    userId: number;
    role: UserRole;
}