
export interface MilkRecord {
  id: string;
  animalId: string;
  quantity: number;
  date: string;
  quality: "A" | "B" | "C";
  notes: string;
  createdBy: string;
  createdAt: number;
}

export type NewMilkRecord = Omit<MilkRecord, "id" | "createdBy" | "createdAt">;
