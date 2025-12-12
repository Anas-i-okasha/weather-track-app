import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1765522967136 implements MigrationInterface {
	name = 'CreateUsersTable1765522967136';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "users" (
			"id" SERIAL NOT NULL,
			"first_name" character varying(256) NOT NULL,
			"last_name" character varying(256) NOT NULL,
			"email" character varying(256) NOT NULL,
			"password" text NOT NULL,
			"created_at" TIMESTAMP NOT NULL DEFAULT now(),
			"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
			"deleted_at" TIMESTAMP,
			CONSTRAINT "user_email_unique" UNIQUE ("email"),
			CONSTRAINT "user_pk" PRIMARY KEY ("id"))`);

		await queryRunner.query(
			`CREATE INDEX "users_email_idx" ON "users" ("email") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."users_email_idx"`);
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
