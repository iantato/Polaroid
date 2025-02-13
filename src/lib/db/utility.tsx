import { readFileSync } from 'fs';
import { join } from 'path';

export const SQL_QUERIES = {
  GET_ALL: loadSqlFile('/get_all.sql'),
  CREATE: loadSqlFile('/create.sql'),
  SCANNED: loadSqlFile('/get_scanned.sql'),
  GET_BY_ID: loadSqlFile('/get_by_id.sql'),
  UPDATE_SCANNED: loadSqlFile('/update_scanned.sql'),
  GET_MUSIC: loadSqlFile('/get_music.sql'),
} as const;

function loadSqlFile(filename: string): string {
  return readFileSync(
      join(process.cwd(), 'src/lib/db/queries', filename),
      'utf8'
  );
}