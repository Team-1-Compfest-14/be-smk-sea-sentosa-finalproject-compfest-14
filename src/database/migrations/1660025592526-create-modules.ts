import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createModules1660025592526 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE module_type AS ENUM ('lecture', 'quiz');

            CREATE TABLE "modules" (
                "id" SERIAL NOT NULL,
                "course_id" INT NOT NULL,
                "order" INT NOT NULL,
                "name" VARCHAR(64) NOT NULL,
                "type" module_type NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TYPE module_type;
            DROP TABLE "modules";
        `);
    }

}
