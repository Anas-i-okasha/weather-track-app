import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	Index,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'character varying', length: 256, nullable: false })
	first_name: string;

	@Column({ type: 'character varying', length: 256, nullable: false })
	last_name: string;

	@Column({ type: 'character varying', length: 256, unique: true })
	@Index('users_email_idx')
	email: string;

	@Column({ type: 'text', nullable: false })
	password: string;

	@CreateDateColumn({ type: 'timestamp without time zone' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp without time zone' })
	updated_at: Date;

	@DeleteDateColumn({ type: 'timestamp without time zone' })
	deleted_at: Date;
}
