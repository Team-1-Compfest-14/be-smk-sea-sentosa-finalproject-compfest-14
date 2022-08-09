import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersAnswers1660052264714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users_answers" (
                "id" SERIAL NOT NULL,
                "question_id" INT NOT NULL,
                "user_id" INT NOT NULL,
                "question_option_id" INT NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("question_id") REFERENCES "questions"("id"),
                FOREIGN KEY ("user_id") REFERENCES "users"("id"),
                FOREIGN KEY ("question_option_id") REFERENCES "question_options"("id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "users_answers"');
    }

}
