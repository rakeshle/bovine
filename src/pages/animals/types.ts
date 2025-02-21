
export interface Animal {
  id: string;
  tagNumber: string;
  breed: string;
  birthDate: string;
  gender: "male" | "female";
  status: "healthy" | "sick" | "quarantined";
  notes: string;
  createdBy: string;
  createdAt: number;
}

export type NewAnimal = Omit<Animal, "id" | "createdBy" | "createdAt">;
