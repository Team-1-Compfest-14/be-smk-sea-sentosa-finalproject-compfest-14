import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createCourseEnrollments1660025616458
implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "course_enrollments" (
                "id" SERIAL NOT NULL,
                "user_id" INT NOT NULL,
                "course_id" INT NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "course_enrollments"');
    }

}
