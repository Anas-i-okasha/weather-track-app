import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('weather_request_logs')
export class WeatherRequestLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Index('weather_request_city_idx')
	@Column({ nullable: true })
	city: string;

	@Column({ type: 'numeric', nullable: true })
	latitude: number;

	@Column({ type: 'numeric', nullable: true })
	longitude: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}
