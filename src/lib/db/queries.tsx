import { getPool } from './index';
import { SQL_QUERIES } from './utility';
import { ApiResponse, Polaroid } from '@/types';

export async function getAllPolaroids(): Promise<ApiResponse<Polaroid[]>> {
  try {
    const pool = getPool();
    const result = await pool.query(SQL_QUERIES.GET_ALL);
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch polaroids'
    };
  }
}

export async function getById(id: number): Promise<ApiResponse<Polaroid>> {
  try {
    const pool = getPool();
    const result = await pool.query(SQL_QUERIES.GET_BY_ID, [id]);
    return {
      success: true,
      data: result.rows[0]
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch polaroid'
    };
  }
}

export async function getScanned(): Promise<ApiResponse<Polaroid[]>> {
  try {
    const pool = getPool();
    const result = await pool.query(SQL_QUERIES.SCANNED);
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch scanned polaroids'
    };
  }
}

export async function getMusic(id: number): Promise<ApiResponse<Polaroid[]>> {
  try {
    const pool = getPool();
    const result = await pool.query(SQL_QUERIES.GET_MUSIC, [id]);
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch music'
    };
  }
}
