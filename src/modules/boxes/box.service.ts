import type { Box } from "./box.schema";

import { BoxRepository } from "./box.repository";
import { historyService } from "@/src/modules/history/history.service";
import { HistoryAction, HistoryEntityType } from "@/src/modules/history/types";

import type { CreateBoxInput, UpdateBoxInput } from "./types";

export class BoxService {
  async list(): Promise<Box[]> {
    return BoxRepository.list();
  }

  async get(id: number): Promise<Box | undefined> {
    return BoxRepository.get(id);
  }

  async getByLabel(label: string): Promise<Box | undefined> {
    return BoxRepository.getByLabel(label);
  }

  async create(data: CreateBoxInput): Promise<number> {
    const newBoxId = await BoxRepository.create(data);

    historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: newBoxId,
      action: HistoryAction.CREATE,
      data: JSON.stringify(data),
    });

    return newBoxId;
  }

  async update(id: number, data: UpdateBoxInput): Promise<boolean> {
    const updated = await BoxRepository.update(id, data);

    historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: id,
      action: HistoryAction.UPDATE,
      data: JSON.stringify(data),
    });

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    const removed = await BoxRepository.remove(id);

    historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: id,
      action: HistoryAction.DELETE,
      data: JSON.stringify({ id }),
    });

    return removed;
  }
}

export const boxService = new BoxService();
