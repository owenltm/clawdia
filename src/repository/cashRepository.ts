import { db } from '@/src/db/database'
import { Cash, NewCash, CashUpdate } from '@/src/db/types'

export const listAllCash = async (
  limit?: number,
  offset?: number
): Promise<Cash[]> => {
  const query = db.selectFrom('cash').selectAll();

  if(limit) {
    query.limit(limit);
  }

  if(offset) {
    query.offset(offset);
  }

  const result = await query.execute();
  return result;
}

export const getCashById = async (id: number): Promise<Cash | undefined> => {
  // TODO: Implement this function to fetch a cash record by its ID
  return undefined;
}

export const createCash = async (newCash: NewCash): Promise<Cash | undefined> => {
  // TODO: Implement this function to create a new cash record
  return undefined;
}

export const updateCash = async (id: number, cashUpdate: CashUpdate): Promise<Cash | undefined> => {
  // TODO: Implement this function to update a cash record by its ID
  return undefined;
}

export const deleteCash = async (id: number): Promise<void> => {
  // TODO: Implement this function to delete a cash record by its ID
}