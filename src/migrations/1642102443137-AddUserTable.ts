import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1642102443137 implements MigrationInterface {
    name = 'AddUserTable1642102443137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_8b556155b57fea6ceb42921fe6c"`);
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_a884fc9f6061a57a90ec3d69ab2"`);
        await queryRunner.query(`ALTER TABLE "entry_activity" DROP CONSTRAINT "FK_4a2742359e5c9685da60114e1d9"`);
        await queryRunner.query(`ALTER TABLE "entry_activity" DROP CONSTRAINT "FK_8e8ddbcc81491aa2e0b2f4e3a08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a2742359e5c9685da60114e1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e8ddbcc81491aa2e0b2f4e3a0"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "status_id_seq" OWNED BY "status"."id"`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" SET DEFAULT nextval('"status_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`CREATE INDEX "IDX_e2b6a3e6ca27aaceb93d10d1b2" ON "entry_activity" ("entryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4374b86bd37e309e5cdafb2616" ON "entry_activity" ("activityId") `);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_925a39b5eb6a1960d3f0eb462e4" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_ddac32f089911c10877ab75c40c" FOREIGN KEY ("statusItemId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_activity" ADD CONSTRAINT "FK_e2b6a3e6ca27aaceb93d10d1b22" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "entry_activity" ADD CONSTRAINT "FK_4374b86bd37e309e5cdafb2616c" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry_activity" DROP CONSTRAINT "FK_4374b86bd37e309e5cdafb2616c"`);
        await queryRunner.query(`ALTER TABLE "entry_activity" DROP CONSTRAINT "FK_e2b6a3e6ca27aaceb93d10d1b22"`);
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_ddac32f089911c10877ab75c40c"`);
        await queryRunner.query(`ALTER TABLE "entry_status" DROP CONSTRAINT "FK_925a39b5eb6a1960d3f0eb462e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4374b86bd37e309e5cdafb2616"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2b6a3e6ca27aaceb93d10d1b2"`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" SET DEFAULT nextval('status_item_id_seq')`);
        await queryRunner.query(`ALTER TABLE "status" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "status_id_seq"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_8e8ddbcc81491aa2e0b2f4e3a0" ON "entry_activity" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a2742359e5c9685da60114e1d" ON "entry_activity" ("entryId") `);
        await queryRunner.query(`ALTER TABLE "entry_activity" ADD CONSTRAINT "FK_8e8ddbcc81491aa2e0b2f4e3a08" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "entry_activity" ADD CONSTRAINT "FK_4a2742359e5c9685da60114e1d9" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_a884fc9f6061a57a90ec3d69ab2" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_status" ADD CONSTRAINT "FK_8b556155b57fea6ceb42921fe6c" FOREIGN KEY ("statusItemId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
