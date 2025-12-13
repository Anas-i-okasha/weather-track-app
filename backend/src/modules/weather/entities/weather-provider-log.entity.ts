import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { WeatherResponse } from '../weather-response/weather-response.interface';

@Entity('weather_request_logs')
export class WeatherRequestLog {
	@PrimaryGeneratedColumn()
	id: number;

	@Index('weather_request_provider_idx')
	@Column({ type: 'character varying', length: 100, nullable: false })
	provider_name: string;

	@Index('weather_request_city_idx')
	@Column({ nullable: true })
	city: string;

	@Column({ type: 'numeric', nullable: true })
	latitude: number;

	@Column({ type: 'numeric', nullable: true })
	longitude: number;

	@Column({ type: 'json', nullable: true })
	provider_response: WeatherResponse;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}
