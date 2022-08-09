import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuestions1660044682154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "questions" (
                "id" SERIAL NOT NULL,
                "quiz_id" INT NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "questions"');
    }

}
