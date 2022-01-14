import {MigrationInterface, QueryRunner} from "typeorm";

export class User1642192337212 implements MigrationInterface {
    name = 'User1642192337212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_ddac32f089911c10877ab75c40c"`);
        await queryRunner.query(`ALTER TABLE "entry_status" RENAME COLUMN "statusItemId" TO "statusId"`);
        await queryRunner.query(`ALTER TABLE "status" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "status_id_seq" OWNED BY "status"."id"`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" SET DEFAULT nextval('"status_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "status" ADD CONSTRAINT "FK_94cb5dda3cf592da917ec3a2746" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_aea37b53daffb44f3226e193ce5" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_a43c2ecae5cadbff32cc3c4e665" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3571467bcbe021f66e2bdce96ea"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_a43c2ecae5cadbff32cc3c4e665"`);
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_aea37b53daffb44f3226e193ce5"`);
        await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_94cb5dda3cf592da917ec3a2746"`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "status_id_seq"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "status" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "entry_status" RENAME COLUMN "statusId" TO "statusItemId"`);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_ddac32f089911c10877ab75c40c" FOREIGN KEY ("statusItemId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
