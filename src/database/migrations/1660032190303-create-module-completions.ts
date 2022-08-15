import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createModuleCompletions1660032190303
implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "module_completions" (
                "id" SERIAL NOT NULL,
                "module_id" INT NOT NULL,
                "user_id" INT NOT NULL,
                "completion_time" TIMESTAMP NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("module_id") REFERENCES "modules" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "module_completions"');
    }

}
