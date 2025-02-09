import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { join } from 'path';
import { mode } from './utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: String(process.env.DATABASE_PASS),
  database: process.env.DATABASE_DB_NAME,
  synchronize: true,
  migrations: [__dirname, '/migrations/*.js'],
  entities: [__dirname + '/entities/*.entity.{ts,js}'],
});
