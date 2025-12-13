import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeatherRequestLogTable1765629265575 implements MigrationInterface {
	name = 'CreateWeatherRequestLogTable1765629265575';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "weather_request_logs" (
			"id" SERIAL NOT NULL,
			"city" character varying,
			"latitude" numeric,
			"longitude" numeric,
			"created_at" TIMESTAMP NOT NULL DEFAULT now(),
			"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
			"deleted_at" TIMESTAMP,
			CONSTRAINT "pk_weather_request" PRIMARY KEY ("id"))`);

		await queryRunner.query(
			`CREATE INDEX "weather_request_city_idx" ON "weather_request_logs" ("city") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."weather_request_city_idx"`,
		);
		await queryRunner.query(`DROP TABLE "weather_request_logs"`);
	}
}
