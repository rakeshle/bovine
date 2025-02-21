
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { HealthStats } from "./components/HealthStats";
import { HealthForm } from "./components/HealthForm";
import { HealthTable } from "./components/HealthTable";
import type { HealthRecord } from "./types";

export default function HealthMonitoring() {
  const { user, role } = useAuthState();

  const { data: healthRecords, isLoading } = useQuery<HealthRecord[]>({
    queryKey: ["healthRecords"],
    queryFn: async () => {
      const recordsRef = collection(db, "healthRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as HealthRecord[];
          resolve(records);
        });
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="animate-fadeIn space-y-6">
        <HealthStats healthRecords={healthRecords} />
        
        {(role === "admin" || role === "veterinarian") && (
          <HealthForm user={user} />
        )}

        <HealthTable
          healthRecords={healthRecords}
          isLoading={isLoading}
          role={role}
        />
      </div>
    </DashboardLayout>
  );
}
