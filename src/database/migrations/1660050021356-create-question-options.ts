import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createQuestionOptions1660050021356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "question_options" (
                "id" SERIAL NOT NULL,
                "question_id" INT NOT NULL,
                "option" VARCHAR(128) NOT NULL,
                "is_correct_answer" BOOLEAN NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("question_id") REFERENCES "questions"("id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "question_options"');
    }

}
