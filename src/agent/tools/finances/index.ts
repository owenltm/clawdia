import { callFinanceAgentTool } from "./callFinanceAgent";
import { addExpenses } from "./addExpenses";
import { addRevenue } from "./addRevenue";

export const financeTools = {
  addExpenses,
  addRevenue,
}