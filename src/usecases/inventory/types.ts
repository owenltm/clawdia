import { BoxStatus } from "@modules/inventory/types";
import { Crab } from "@modules/inventory/entities";

export type Inventory = {
  id: number,
  label: string,
  status: BoxStatus,
  content: Crab[]
}