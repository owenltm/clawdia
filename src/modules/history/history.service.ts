import type { HistoryLog } from "./history.schema";
import { HistoryRepository } from "./history.repository";
import type { CreateHistoryInput, UpdateHistoryInput, ListHistoryParams } from "./types";

export class HistoryService {
  async list(params: ListHistoryParams = {}): Promise<HistoryLog[]> {
    return HistoryRepository.list(params);
  }

  async get(id: number): Promise<HistoryLog | undefined> {
    return HistoryRepository.get(id);
  }

  async create(data: CreateHistoryInput): Promise<number> {
    return HistoryRepository.create(data);
  }

  async update(id: number, data: UpdateHistoryInput): Promise<boolean> {
    return HistoryRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return HistoryRepository.remove(id);
  }
}

export const historyService = new HistoryService();

