
export interface User {
  id: string;
  email: string;
  role: "admin" | "veterinarian" | "worker";
  name: string;
  createdAt: number;
}
