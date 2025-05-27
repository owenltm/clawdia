import { sql } from 'kysely'
import { db } from '@/src/db/database'
import { Crabs } from '@/src/db/types'

const currentStock = db
  .with('current_stock', db => 
    db.selectFrom('crabs')
      .selectAll()
      .select(({ fn }) => [
        sql<number>`ROW_NUMBER() OVER (PARTITION BY boxid ORDER BY orderdt DESC)`.as('rn')
      ])
  )
  .selectFrom('current_stock')
  .selectAll()
  .where(({ eb, and }) => and([
    eb('rn', '=', 1),
    eb('exitdt', 'is', null)
  ]));

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

export const inputStock = async (
  boxid: string,
  weight: number,
  supplier: string,
  orderdt: Date
) => {
  throw new Error('Not implemented');
}

export const outputStock = async (
  boxid: string,
  exitdt: Date,
  exitWeight: number,
  exitType: string
) => {
  throw new Error('Not implemented');
}

export const getStockByBoxid = async (
  boxid: string
): Promise<Crabs | undefined> => {
  throw new Error('Not implemented');
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