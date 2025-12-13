import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeatherRequestLogTable1765633792976 implements MigrationInterface {
	name = 'CreateWeatherRequestLogTable1765633792976';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "weather_request_logs" (
			"id" SERIAL NOT NULL,
			"provider_name" character varying(100) NOT NULL,
			"city" character varying,
			"latitude" numeric,
			"longitude" numeric,
			"provider_response" json,
			"created_at" TIMESTAMP NOT NULL DEFAULT now(),
			"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
			"deleted_at" TIMESTAMP,
			CONSTRAINT "pk_weather_log" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "weather_request_provider_idx" ON "weather_request_logs" ("provider_name") `,
		);
		await queryRunner.query(
			`CREATE INDEX "weather_request_city_idx" ON "weather_request_logs" ("city") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."weather_request_city_idx"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."weather_request_provider_idx"`,
		);
		await queryRunner.query(`DROP TABLE "weather_request_logs"`);
	}
}
