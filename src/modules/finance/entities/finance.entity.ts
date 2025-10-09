import type { FinanceJournal as FinanceJournalSchema } from "../schemas/finance.schema";

export class FinanceJournal {
  constructor(
    public readonly id: number,
    public readonly type: "revenue" | "expense",
    public readonly amount: number,
    public readonly category: string,
    public readonly date: Date,
    public readonly referenceId: number | null,
    public readonly description: string | null,
    public readonly createdAt: Date
  ) {}

  /**
   * Get formatted amount as currency string
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.amount);
  }

  /**
   * Get date as ISO string (YYYY-MM-DD)
   */
  getDateString(): string {
    return this.createdAt.toISOString().slice(0, 10);
  }
}

/**
 * Mapper function to convert DB schema to FinanceJournal entity
 */
export function mapToFinanceJournal(dbRow: FinanceJournalSchema): FinanceJournal {
  return new FinanceJournal(
    dbRow.id,
    dbRow.type,
    typeof dbRow.amount === "string" ? Number(dbRow.amount) : dbRow.amount,
    dbRow.category,
    dbRow.date,
    dbRow.referenceId,
    dbRow.description,
    dbRow.createdAt
  );
}

/**
 * Mapper function to convert array of DB rows to FinanceJournal entities
 */
export function mapToFinanceJournals(dbRows: FinanceJournalSchema[]): FinanceJournal[] {
  return dbRows.map(mapToFinanceJournal);
}
