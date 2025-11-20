import { NotFoundError } from "@/src/errors/HttpError";
import type { FinanceJournal } from "./entities/finance.entity";
import { FinanceRepository } from "./repositories/finance.repository";
import type { ListFinanceParams, DailyFinanceSummary, CreateFinanceParam } from "./types";

export class FinanceUseCase {
  async getFinanceOverview(startDate: string, endDate: string) {  
    const list = await this.getDailyList(startDate, endDate);

    let totalRevenue = 0;
    let totalExpenses = 0;

    let totalRevenueByCategory: Record<string, number> = {};
    let totalExpensesByCategory: Record<string, number> = {};

    for (const day of list) {
      for (const revenue of day.revenues) {
        totalRevenue += revenue.amount;
        totalRevenueByCategory[revenue.category] = (totalRevenueByCategory[revenue.category] || 0) + revenue.amount;
      }

      for (const expense of day.expenses) {
        totalExpenses += expense.amount;
        totalExpensesByCategory[expense.category] = (totalExpensesByCategory[expense.category] || 0) + expense.amount;
      }
    }

    return {
      totalRevenue,
      totalExpenses,
      totalRevenueByCategory,
      totalExpensesByCategory,
      dailySummary: list,
    }
  }

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
    const finance = await FinanceRepository.get(id);

    if(!finance) {
      throw new NotFoundError("Finance");
    }
    
    return finance;
  }

  async create(data: CreateFinanceParam): Promise<number> {
    return FinanceRepository.create(data);
  }

  async update(id: number, data: Partial<CreateFinanceParam>): Promise<boolean> {
    return FinanceRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return FinanceRepository.remove(id);
  }
}

export const financeUseCase = new FinanceUseCase();

