
export interface HealthRecord {
  id: string;
  animalId: string;
  animalTagNumber: string;
  type: "vaccination" | "checkup" | "treatment";
  date: string;
  description: string;
  performedBy: string;
  status: "completed" | "scheduled" | "cancelled";
  notes: string;
  createdAt: number;
}

export type NewHealthRecord = Omit<HealthRecord, "id" | "performedBy" | "createdAt">;
