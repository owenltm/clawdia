import { boxService } from "@/src/modules/inventory/services/box.service";
import { BoxStatus, CreateBoxParam, CreateCrabInput, UpdateBoxParam, UpdateCrabInput } from "@/src/modules/inventory/types";
import { crabService } from "@/src/modules/inventory/services/crab.service";
import { CrabStatus } from "@/src/modules/inventory/types";
import { historyService } from "@/src/modules/history/history.service";
import { HistoryAction, HistoryEntityType } from "@/src/modules/history/types";
import { Inventory } from "./types";

export class InventoryUseCase {
  async getInventoryOverview(): Promise<any> {
    // Get current boxes status overview (empty, filled)
    // Get occupancy rate (filled / total)

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const crabInStock = await crabService.list({ status: CrabStatus.IN });
    const newCrabsThisMonth = await crabService.list({ status: CrabStatus.IN, checkedInAfter: startOfMonth });
    const soldCrabsThisMonth = await crabService.list({ status: CrabStatus.SOLD, checkedOutAfter: startOfMonth, checkedOutBefore: endOfMonth });
    const deadCrabsThisMonth = await crabService.list({ status: CrabStatus.DEAD, checkedOutAfter: startOfMonth, checkedOutBefore: endOfMonth });

    const inventory = await this.getCurrentInventory();
    const filledBoxes = inventory.filter(inventory => inventory.status === BoxStatus.FILLED).length;
    const emptyBoxes = inventory.filter(inventory => inventory.status === BoxStatus.EMPTY).length;
    const totalBoxes = inventory.length;
    const occupancyRate = totalBoxes > 0 ? (filledBoxes / totalBoxes) * 100 : 0;

    return {
      crabInStock: crabInStock.length,
      newCrabsThisMonth: newCrabsThisMonth.length,
      soldCrabsThisMonth: soldCrabsThisMonth.length,
      deadCrabsThisMonth: deadCrabsThisMonth.length,
      BoxStatus: { filled: filledBoxes, empty: emptyBoxes, total: totalBoxes },
      occupancyRate: occupancyRate.toFixed(2) + "%",
    };
  }

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
    return boxes.map(box => {
      const boxCrabs = crabsByBoxId[box.id] || [];

      return {
        ...box,
        content: boxCrabs
      };
    });
  }

  async newCrabCheckin({
    boxId,
    data,
  }: {
    boxId: number;
    data: Omit<CreateCrabInput, 'boxId'>;
  }): Promise<number> {
    try {
      // const box = await boxService.getByLabel(boxLabel);
      // if (!box) {
      //   throw new Error(`Box with label ${boxLabel} not found`);
      // }

      const [newCrabId, updatedBox] = await Promise.all([
        await crabService.create({
          ...data,
          boxId, // Assuming CreateCrabInput has a boxId field
        }),
        await boxService.update(boxId, {
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

  async updateCrabCheckout({
    boxId, status
  }:{
    boxId: number,
    status: CrabStatus.SOLD | CrabStatus.DEAD
  }): Promise<boolean> {
    try {
      // const box = await boxService.getByLabel(boxLabel);
      // if (!box) {
      //   throw new Error(`Box with label ${boxLabel} not found`);
      // }

      const crab = await crabService.getByBoxId(boxId);
      if (!crab) {
        throw new Error(`No crab found in box with id ${boxId}`);
      }

      const [updatedCrab, updatedBox] = await Promise.all([
        crabService.update(crab.id, { status, checkOutDate: new Date(), boxId: null }),
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

  // Box management methods with business logic
  async createBox(data: CreateBoxParam): Promise<number> {
    const newBoxId = await boxService.create(data);

    await historyService.create({
      entityType: HistoryEntityType.BOX,
      entityId: newBoxId,
      action: HistoryAction.CREATE,
      data: JSON.stringify(data),
    });

    return newBoxId;
  }

  async updateBox(id: number, data: UpdateBoxParam): Promise<boolean> {
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

  // Crab management methods with business logic
  async createCrab(data: CreateCrabInput): Promise<number> {
    const newCrabId = await crabService.create(data);

    historyService.create({
      entityType: HistoryEntityType.CRAB,
      entityId: newCrabId,
      action: HistoryAction.CHECKIN,
      data: JSON.stringify(data),
    });

    return newCrabId;
  }

  async updateCrab(id: number, data: UpdateCrabInput): Promise<boolean> {
    const updated = await crabService.update(id, data);

    if (data.status === CrabStatus.SOLD || data.status === CrabStatus.DEAD) {
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
    }

    return updated;
  }

  async removeCrab(id: number): Promise<boolean> {
    const removed = await crabService.remove(id);

    historyService.create({
      entityType: HistoryEntityType.CRAB,
      entityId: id,
      action: HistoryAction.DELETE,
      data: JSON.stringify({ id }),
    });

    return removed;
  }
}

export const inventoryUseCase = new InventoryUseCase();