import type { Crab } from "../schemas/crab.schema";

import { CrabRepository } from "../repositories/crab.repository";
import { historyService } from "@/src/modules/history/history.service";
import { HistoryAction, HistoryEntityType } from "@/src/modules/history/types";

import { CreateCrabInput, ListCrabsParams, UpdateCrabInput } from "../types";

export class CrabService {
  async list(params: ListCrabsParams): Promise<Crab[]> {
    return CrabRepository.list(params);
  }

  async get(id: number): Promise<Crab | undefined> {
    return CrabRepository.get(id);
  }

  async getByBoxId(boxId: number): Promise<Crab> {
    return CrabRepository.getByBoxId(boxId);
  }

  async create(data: CreateCrabInput): Promise<number> {
    return await CrabRepository.create(data);
  }

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    return await CrabRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return await CrabRepository.remove(id);
  }
}

export const crabService = new CrabService();
