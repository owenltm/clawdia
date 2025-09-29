import type { Crab } from "../schemas/crab.schema";

import { CrabRepository } from "../repositories/crab.repository";
import { historyService } from "@/src/modules/history/history.service";
import { HistoryAction, HistoryEntityType } from "@/src/modules/history/types";

import { CrabStatus, CreateCrabInput, UpdateCrabInput } from "../types";

export class CrabService {
  async list(): Promise<Crab[]> {
    return CrabRepository.list({});
  }

  async get(id: number): Promise<Crab | undefined> {
    return CrabRepository.get(id);
  }

  async getByBoxId(boxId: number): Promise<Crab> {
    return CrabRepository.getByBoxId(boxId);
  }

  async create(data: CreateCrabInput): Promise<number> {
    const newCrabId = await CrabRepository.create(data);

    /* historyService.create({
      entityType: HistoryEntityType.CRAB,
      entityId: newCrabId,
      action: HistoryAction.CHECKIN,
      data: JSON.stringify(data),
    }); */

    return newCrabId;
  }

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    const updated = await CrabRepository.update(id, data);

    /* if (data.status === CrabStatus.SOLD || data.status === CrabStatus.DEAD) {
      historyService.create({
        entityType: HistoryEntityType.CRAB,
        entityId: id,
        action: HistoryAction.CHECKOUT,
        data: JSON.stringify(data),
      });
    } else {
      // TODO: Check if boxid changed, then action should be transfer
      historyService.create({
        entityType: HistoryEntityType.CRAB,
        entityId: id,
        action: HistoryAction.TRANSFER,
        data: JSON.stringify(data),
      });
    } */

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    const removed = await CrabRepository.remove(id);

    /* historyService.create({
      entityType: HistoryEntityType.CRAB,
      entityId: id,
      action: HistoryAction.DELETE,
      data: JSON.stringify({ id }),
    }); */

    return removed;
  }
}

export const crabService = new CrabService();
