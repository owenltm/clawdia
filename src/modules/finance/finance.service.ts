import { FinanceRepository } from "./repositories/finance.repository";
import type { CreateFinanceInput, UpdateFinanceInput, ListFinanceParams, DailyFinanceSummary, CreateFinanceParam } from "./types";
import type { FinanceJournal } from "./models/finance.model";

export class FinanceService {
  async list(params: ListFinanceParams = {}): Promise<FinanceJournal[]> {
    return FinanceRepository.list(params);
  }

  async getDailyList(startDate: string, endDate: string): Promise<DailyFinanceSummary[]> {
    // Fetch all finance records in the date range
    const finances = await FinanceRepository.getDailyFinanceSummary(new Date(startDate), new Date(endDate));

    // Group by date
    const dailyMap: Record<string, { revenues: FinanceJournal[]; expenses: FinanceJournal[] }> = {};
    for (const finance of finances) {
      const date = finance.createdAt.toISOString().slice(0, 10); // Get YYYY-MM-DD
      if (!date) continue;
      if (!dailyMap[date]) {
        dailyMap[date] = { revenues: [], expenses: [] };
      }
      if (finance.type === "revenue") {
        dailyMap[date].revenues.push(finance);
      } else if (finance.type === "expense") {
        dailyMap[date].expenses.push(finance);
      }
    }

    // Build summary list
    const dailyList: DailyFinanceSummary[] = Object.entries(dailyMap).map(([date, { revenues, expenses }]) => ({
      date,
      revenues,
      expenses,
    }));

    // Optionally sort by date ascending
    dailyList.sort((a, b) => a.date.localeCompare(b.date));
    return dailyList;
  }

  async get(id: number): Promise<FinanceJournal | undefined> {
    return FinanceRepository.get(id);
  }

  async create(data: CreateFinanceParam): Promise<number> {
    return FinanceRepository.create(data);
  }

  async update(id: number, data: Partial<FinanceJournal>): Promise<boolean> {
    return FinanceRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return FinanceRepository.remove(id);
  }
}

export const financeService = new FinanceService();

