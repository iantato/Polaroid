import { readFileSync } from 'fs';
import { join } from 'path';

export const SQL_QUERIES = {
  GET_ALL: loadSqlFile('/get_all.sql'),
  CREATE: loadSqlFile('/create.sql'),
} as const;

function loadSqlFile(filename: string): string {
  return readFileSync(
      join(process.cwd(), 'src/lib/db/queries', filename),
      'utf8'
  );
}