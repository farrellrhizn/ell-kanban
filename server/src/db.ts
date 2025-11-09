import dotenv from 'dotenv';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

type QueryParam = string | number | boolean | Date | Record<string, unknown> | string[] | null;

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: QueryParam[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export const getClient = async (): Promise<PoolClient> => pool.connect();
