import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuizzes1660032058666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "quizzes" (
                "id" SERIAL NOT NULL,
                "module_id" INT NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("module_id") REFERENCES "modules"("id")
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "quizzes"');
    }

}
