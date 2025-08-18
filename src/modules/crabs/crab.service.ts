import type { Crab } from "../../db/schema";
import { CrabRepository } from "./crab.repository";

import type { CreateCrabInput, UpdateCrabInput, ListCrabsParams } from "./crab.repository";

export class CrabService {
  async list(params: ListCrabsParams = {}): Promise<Crab[]> {
    return CrabRepository.list(params);
  }

  async get(id: number): Promise<Crab | undefined> {
    return CrabRepository.get(id);
  }

  async create(data: CreateCrabInput): Promise<number> {
    return CrabRepository.create(data);
  }

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    return CrabRepository.update(id, data);
  }

  async remove(id: number): Promise<boolean> {
    return CrabRepository.remove(id);
  }
}

export const crabService = new CrabService();
