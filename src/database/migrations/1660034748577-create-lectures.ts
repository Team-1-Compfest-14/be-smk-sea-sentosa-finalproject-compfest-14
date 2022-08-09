import type { MigrationInterface, QueryRunner } from 'typeorm';

export class createLectures1660034748577 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lectures" (
                "id" SERIAL NOT NULL,
                "module_id" INT NOT NULL,
                "lecture_link" VARCHAR(64) NOT NULL,

                PRIMARY KEY ("id"),
                FOREIGN KEY ("module_id") REFERENCES "modules"("id")
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "lectures"');
    }

}
