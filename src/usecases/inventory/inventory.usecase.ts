import { boxService } from "@/src/modules/boxes/box.service";
import { BoxStatus, CreateBoxInput, UpdateBoxInput } from "@/src/modules/boxes/types";
import { crabService } from "@/src/modules/crabs/crab.service";
import { CrabStatus, CreateCrabInput } from "@/src/modules/crabs/types";
import { historyService } from "@/src/modules/history/history.service";
import { HistoryAction, HistoryEntityType } from "@/src/modules/history/types";
import { Inventory } from "./types";

export class InventoryUseCase {
  async getCurrentInventory(): Promise<Inventory[]> {
    // Get all boxes
    const boxes = await boxService.list();
    // Get all crabs with status IN
    const crabs = await crabService.list({ status: CrabStatus.IN });

    // Group crabs by boxId
    const crabsByBoxId: Record<number, any[]> = {};
    for (const crab of crabs) {
      if (crab.boxId != null) {
        if (!crabsByBoxId[crab.boxId]) crabsByBoxId[crab.boxId] = [];
        crabsByBoxId[crab.boxId].push(crab);
      }
    }

    // Map boxes to Inventory objects
    return boxes.map(box => ({
      id: box.id,
      label: box.label,
      status: box.status,
      content: crabsByBoxId[box.id] || []
    }));
  }

  async newCrabCheckin(
    data: CreateCrabInput,
    boxLabel: string
  ): Promise<number> {
    try {
      const box = await boxService.getByLabel(boxLabel);
      if (!box) {
        throw new Error(`Box with label ${boxLabel} not found`);
      }

      const [newCrabId, updatedBox] = await Promise.all([
        await crabService.create({
          ...data,
          boxId: box.id, // Assuming CreateCrabInput has a boxId field
        }),
        await boxService.update(box.id, {
          status: BoxStatus.FILLED,
        })
      ]);

      return newCrabId;
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(`Error check in crab: ${errorMessage}`);
    }
  }

  async updateCrabCheckout(
    boxLabel: string,
    status: CrabStatus.SOLD | CrabStatus.DEAD
  ): Promise<boolean> {
    try {
      const box = await boxService.getByLabel(boxLabel);
      if (!box) {
        throw new Error(`Box with label ${boxLabel} not found`);
      }

      const crab = await crabService.getByBoxId(box.id);
      if (!crab) {
        throw new Error(`No crab found in box with label ${boxLabel}`);
      }

      const [updatedCrab, updatedBox] = await Promise.all([
        crabService.update(crab.id, { status, boxId: null }),
        boxService.update(crab.boxId!, { status: BoxStatus.EMPTY })
      ]);

      return updatedCrab && updatedBox;
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(`Error updating crab checkout: ${errorMessage}`);
    }
  }

  async getCurrentBoxesStatus(): Promise<any[]> {
    return ["Not yet implemented"];
  }

  async getRecentHistory(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    // TODO: Update recent history retrieval
    return await historyService.list();
  }

  // Box management methods with business logic
  async createBox(data: CreateBoxInput): Promise<number> {
    const newBoxId = await boxService.create(data);

    await historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: newBoxId,
      action: HistoryAction.CREATE,
      data: JSON.stringify(data),
    });

    return newBoxId;
  }

  async updateBox(id: number, data: UpdateBoxInput): Promise<boolean> {
    const updated = await boxService.update(id, data);

    await historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: id,
      action: HistoryAction.UPDATE,
      data: JSON.stringify(data),
    });

    return updated;
  }

  async removeBox(id: number): Promise<boolean> {
    const removed = await boxService.remove(id);

    await historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: id,
      action: HistoryAction.DELETE,
      data: JSON.stringify({ id }),
    });

    return removed;
  }
}

export const inventoryUseCase = new InventoryUseCase();