
export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
  createdBy: string;
  createdAt: number;
}

export type NewFinancialRecord = Omit<FinancialRecord, "id" | "createdBy" | "createdAt">;
