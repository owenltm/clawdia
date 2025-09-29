import { crabService } from "@/src/modules/crabs/crab.service";
import { boxService } from "@/src/modules/boxes/box.service";
import { financeService } from "@/src/modules/finance/services/finance.service";

export class OverviewUseCase {
  async getInventoryOverviewData(): Promise<any> {
    return {};
  }

  async getFinanceOverviewData(): Promise<any> {
    return financeService.getDailyList("2025-09-21", "2025-09-27");
  }
}

export const overviewUseCase = new OverviewUseCase();