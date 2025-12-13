import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeatherProviderErrorsTable1765634988120 implements MigrationInterface {
	name = 'CreateWeatherProviderErrorsTable1765634988120';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "weather_provider_error" (
			"id" SERIAL NOT NULL,
			"provider_name" character varying NOT NULL,
			"city" character varying,
			"latitude" numeric,
			"longitude" numeric,
			"error_message" text,
			"created_at" TIMESTAMP NOT NULL DEFAULT now(),
			"updated_at" TIMESTAMP NOT NULL DEFAULT now(),
			"deleted_at" TIMESTAMP,
			CONSTRAINT "pk_provider_error" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "weather_provider_error"`);
	}
}
