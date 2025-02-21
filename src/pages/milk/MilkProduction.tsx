
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MilkStats } from "./components/MilkStats";
import { MilkForm } from "./components/MilkForm";
import { MilkTable } from "./components/MilkTable";
import type { NewMilkRecord, MilkRecord } from "./types";

export default function MilkProduction() {
  const { user, role } = useAuthState();
  const [newRecord, setNewRecord] = useState<NewMilkRecord>({
    animalId: "",
    quantity: 0,
    date: "",
    quality: "A",
    notes: "",
  });

  const { data: milkRecords, isLoading } = useQuery({
    queryKey: ["milkRecords"],
    queryFn: async () => {
      const recordsRef = collection(db, "milkRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise<MilkRecord[]>((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MilkRecord[];
          resolve(records);
        });
      });
    },
  });

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add records");
      return;
    }

    try {
      const recordData = {
        ...newRecord,
        createdBy: user.uid,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "milkRecords"), recordData);
      setNewRecord({
        animalId: "",
        quantity: 0,
        date: "",
        quality: "A",
        notes: "",
      });
      toast.success("Milk production record added successfully");
    } catch (error: any) {
      toast.error("Failed to add record: " + error.message);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete records");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await deleteDoc(doc(db, "milkRecords", id));
      toast.success("Record deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete record: " + error.message);
    }
  };

  const totalProduction = milkRecords?.reduce((acc, record) => acc + record.quantity, 0) || 0;
  const averageQuality = milkRecords?.length 
    ? milkRecords.filter(r => r.quality === "A").length / milkRecords.length * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="animate-fadeIn space-y-6">
        <MilkStats 
          totalProduction={totalProduction}
          averageQuality={averageQuality}
          totalRecords={milkRecords?.length || 0}
        />

        {(role === "admin" || role === "worker") && (
          <MilkForm 
            newRecord={newRecord}
            setNewRecord={setNewRecord}
            onSubmit={handleAddRecord}
          />
        )}

        <MilkTable 
          isLoading={isLoading}
          milkRecords={milkRecords}
          onDelete={handleDeleteRecord}
          canModify={role === "admin" || role === "worker"}
        />
      </div>
    </DashboardLayout>
  );
}
