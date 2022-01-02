import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEntry1641148210263 implements MigrationInterface {
    name = 'CreateEntry1641148210263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "status_item" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_478994ad634ae5b46a3489e00e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entry_status_item" ("id" SERIAL NOT NULL, "entryId" integer NOT NULL, "activityId" integer NOT NULL, "value" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "statusItemId" integer, CONSTRAINT "PK_8d4f5742b6b22f4e82d96a83c65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entry" ("id" SERIAL NOT NULL, "mood" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entry_activities_activity" ("entryId" integer NOT NULL, "activityId" integer NOT NULL, CONSTRAINT "PK_1665ea8d3b4c15928839121acbc" PRIMARY KEY ("entryId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a2742359e5c9685da60114e1d" ON "entry_activities_activity" ("entryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e8ddbcc81491aa2e0b2f4e3a0" ON "entry_activities_activity" ("activityId") `);
        await queryRunner.query(`ALTER TABLE "entry_status_item" ADD CONSTRAINT "FK_a884fc9f6061a57a90ec3d69ab2" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_status_item" ADD CONSTRAINT "FK_8b556155b57fea6ceb42921fe6c" FOREIGN KEY ("statusItemId") REFERENCES "status_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entry_activities_activity" ADD CONSTRAINT "FK_4a2742359e5c9685da60114e1d9" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "entry_activities_activity" ADD CONSTRAINT "FK_8e8ddbcc81491aa2e0b2f4e3a08" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry_activities_activity" DROP CONSTRAINT "FK_8e8ddbcc81491aa2e0b2f4e3a08"`);
        await queryRunner.query(`ALTER TABLE "entry_activities_activity" DROP CONSTRAINT "FK_4a2742359e5c9685da60114e1d9"`);
        await queryRunner.query(`ALTER TABLE "entry_status_item" DROP CONSTRAINT "FK_8b556155b57fea6ceb42921fe6c"`);
        await queryRunner.query(`ALTER TABLE "entry_status_item" DROP CONSTRAINT "FK_a884fc9f6061a57a90ec3d69ab2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8e8ddbcc81491aa2e0b2f4e3a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a2742359e5c9685da60114e1d"`);
        await queryRunner.query(`DROP TABLE "entry_activities_activity"`);
        await queryRunner.query(`DROP TABLE "entry"`);
        await queryRunner.query(`DROP TABLE "entry_status_item"`);
        await queryRunner.query(`DROP TABLE "status_item"`);
    }

}
