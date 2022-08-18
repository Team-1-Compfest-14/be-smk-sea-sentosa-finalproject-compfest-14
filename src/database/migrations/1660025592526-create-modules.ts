import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createModules1660025592526 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "modules" (
                "id" SERIAL NOT NULL,
                "course_id" INT NOT NULL,
                "name" VARCHAR(64) NOT NULL,
                "order" INT NOT NULL,
                "type" INT NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "modules";
        `);
    }

}
