import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createCourses1660024317068 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE "courses" (
            "id" SERIAL NOT NULL,
            "instructor_id" SERIAL NOT NULL,
            "name" VARCHAR(64) NOT NULL,
            "description" VARCHAR(128) NOT NULL,
            "is_verified" BOOLEAN NOT NULL,

            PRIMARY KEY ("id"),
            FOREIGN KEY ("instructor_id") REFERENCES "users"("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "courses"');
    }

}
