import type { FinanceJournal } from "../../db/schema";
import { FinanceRepository } from "./finance.repository";
import type { CreateFinanceInput, UpdateFinanceInput, ListFinanceParams } from "../history/types";

export class FinanceService {
  async list(params: ListFinanceParams = {}): Promise<FinanceJournal[]> {
    return FinanceRepository.list(params);
  }

  async get(id: number): Promise<FinanceJournal | undefined> {
    return FinanceRepository.get(id);
  }

  async create(data: CreateFinanceInput): Promise<number> {
    return FinanceRepository.create(data);
  }

  async update(id: number, data: UpdateFinanceInput): Promise<boolean> {
    return FinanceRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return FinanceRepository.remove(id);
  }
}

export const financeService = new FinanceService();

