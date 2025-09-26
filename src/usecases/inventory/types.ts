import { BoxStatus } from "@/src/modules/boxes/types";
import { Crab } from "@/src/modules/crabs/types";

export type Inventory = {
  id: number,
  label: string,
  status: BoxStatus,
  content: Crab[]
}