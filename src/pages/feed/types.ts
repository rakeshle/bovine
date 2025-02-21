
export interface FeedRecord {
  id: string;
  name: string;
  stock: number;
  status: "Good" | "Low" | "Critical";
  lastUpdated: string;
  nutritionalValue: string;
  createdBy: string;
  createdAt: number;
}

export interface NutritionSchedule {
  id: string;
  time: string;
  type: string;
  quantity: string;
  herdSize: number;
  createdBy: string;
  createdAt: number;
}

export type NewFeedRecord = Omit<FeedRecord, "id" | "createdBy" | "createdAt">;
export type NewNutritionSchedule = Omit<NutritionSchedule, "id" | "createdBy" | "createdAt">;
