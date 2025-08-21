import { boxService } from "@/src/modules/boxes/box.service";
import { crabService } from "@/src/modules/crabs/crab.service";
import { CreateCrabInput } from "@/src/modules/crabs/types";
import { historyService } from "@/src/modules/history/history.service";

export class InventoryUseCase {
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
          status: "filled"
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
    status: "sold" | "dead"
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
        boxService.update(crab.boxId!, { status: "empty" })
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
}

export const inventoryUseCase = new InventoryUseCase();