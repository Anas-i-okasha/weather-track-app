import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';

@Entity('weather_provider_error')
export class WeatherProviderErrorLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	provider_name: string;

	@Column({ nullable: true })
	city?: string;

	@Column({ type: 'numeric', nullable: true })
	latitude?: number;

	@Column({ type: 'numeric', nullable: true })
	longitude?: number;

	@Column({ type: 'text', nullable: true })
	error_message?: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}
