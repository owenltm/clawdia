import { sql } from 'kysely'
import { db } from '@/src/db/database'
import { Crabs } from '@/src/db/types'

const currentStock = db.selectFrom('crabs')
  .selectAll()
  .where('exitdt', 'is', null)
  .orderBy('boxid', 'asc');

export const listCurrentStock = async (
  limit?: number,
): Promise<Crabs[]> => {
  const query = currentStock;

  if(limit) {
    query.limit(limit);
  }

  const result = await query.execute();
  return result;
}

export const storeNewStock = async (
  boxid: string | null,
  weight: number,
  supplier: string,
  orderdt: Date
) => {
  throw new Error('Not implemented');
}

export const updateStockExit = async (
  boxid: string,
  exitdt: string,
  exitWeight: number,
  exitType: string
) => {
  return await db.updateTable('crabs')
    .set({
      exitdt: new Date(exitdt),
      exitweight: exitWeight,
      exittype: exitType
    })
    .where('boxid', '=', boxid)
    .executeTakeFirst();
}

export const getStockByBoxid = async (
  boxid: string
): Promise<Crabs | undefined> => {
  return await currentStock.where('boxid', '=', boxid).executeTakeFirst();
}

export const getStockById = async (
  id: number
): Promise<Crabs | undefined> => {
  throw new Error('Not implemented');
}

export const listAllCrab = async (
  limit?: number,
  offset?: number
): Promise<Crabs[]> => {
  const query = db.selectFrom('crabs').selectAll();

  if(limit) {
    query.limit(limit);
  }

  if(offset) {
    query.offset(offset);
  }

  const result = await query.execute();
  return result;
}