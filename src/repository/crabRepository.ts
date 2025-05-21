
import { db } from '@/src/db/database'
import { Crabs } from '@/src/db/types'

export const listAllCrab = async (
  limit?: number,
  offset?: number
): Promise<Crabs[]> => {
  console.log("listAllCrab");
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