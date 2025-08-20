import type { Crab } from "../../db/schema";

import { CrabRepository } from "./crab.repository";
import { historyService } from "@/src/modules/history/history.service";

import type { CreateCrabInput, UpdateCrabInput, ListCrabsParams } from "./crab.repository";

export class CrabService {
  async list(params: ListCrabsParams = {}): Promise<Crab[]> {
    return CrabRepository.list(params);
  }

  async get(id: number): Promise<Crab | undefined> {
    return CrabRepository.get(id);
  }

  async create(data: CreateCrabInput): Promise<number> {
    const newCrabId = await CrabRepository.create(data);

    historyService.create({
      entityType: "crab",
      entityId: newCrabId,
      action: "checkin",
      data: JSON.stringify(data),
    });

    return newCrabId;
  }

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    const updated = await CrabRepository.update(id, data);

    if (data.status === "sold" || data.status === "dead") {
      historyService.create({
        entityType: "crab",
        entityId: id,
        action: "checkout",
        data: JSON.stringify(data),
      });
    } else {
      // TODO: Check if boxid changed, then action should be transfer
      historyService.create({
        entityType: "crab",
        entityId: id,
        action: "update",
        data: JSON.stringify(data),
      });
    }

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    const removed = await CrabRepository.remove(id);

    historyService.create({
      entityType: "crab",
      entityId: id,
      action: "delete",
      data: JSON.stringify({ id }),
    });

    return removed;
  }
}

export const crabService = new CrabService();
