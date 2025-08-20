import type { Box } from "../../db/schema";

import { BoxRepository } from "./box.repository";
import { historyService } from "@/src/modules/history/history.service";

import type { CreateBoxInput, UpdateBoxInput } from "./types";

export class BoxService {
  async list(): Promise<Box[]> {
    return BoxRepository.list();
  }

  async get(id: number): Promise<Box | undefined> {
    return BoxRepository.get(id);
  }

  async create(data: CreateBoxInput): Promise<number> {
    const newBoxId = await BoxRepository.create(data);

    historyService.create({
      entityType: "box",
      entityId: newBoxId,
      action: "create",
      data: JSON.stringify(data),
    });

    return newBoxId;
  }

  async update(id: number, data: UpdateBoxInput): Promise<boolean> {
    const updated = await BoxRepository.update(id, data);

    historyService.create({
      entityType: "box",
      entityId: id,
      action: "update",
      data: JSON.stringify(data),
    });

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    const removed = await BoxRepository.remove(id);

    historyService.create({
      entityType: "box",
      entityId: id,
      action: "delete",
      data: JSON.stringify({ id }),
    });

    return removed;
  }
}

export const boxService = new BoxService();
