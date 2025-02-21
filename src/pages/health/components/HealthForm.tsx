
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import type { NewHealthRecord } from "../types";

interface HealthFormProps {
  user: { uid: string } | null;
}

export function HealthForm({ user }: HealthFormProps) {
  const [newRecord, setNewRecord] = useState<NewHealthRecord>({
    animalTagNumber: "",
    type: "checkup",
    date: "",
    description: "",
    status: "scheduled",
    notes: "",
  });

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add records");
      return;
    }

    try {
      await addDoc(collection(db, "healthRecords"), {
        ...newRecord,
        performedBy: user.uid,
        createdAt: Date.now(),
      });
      
      setNewRecord({
        animalTagNumber: "",
        type: "checkup",
        date: "",
        description: "",
        status: "scheduled",
        notes: "",
      });
      
      toast.success("Health record added successfully");
    } catch (error: any) {
      toast.error("Failed to add health record: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Health Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddRecord} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Animal Tag Number</label>
              <Input
                value={newRecord.animalTagNumber}
                onChange={(e) => setNewRecord(prev => ({ ...prev, animalTagNumber: e.target.value }))}
                placeholder="Enter animal tag number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={newRecord.type}
                onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value as NewHealthRecord["type"] }))}
              >
                <option value="checkup">Checkup</option>
                <option value="vaccination">Vaccination</option>
                <option value="treatment">Treatment</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={newRecord.status}
                onChange={(e) => setNewRecord(prev => ({ ...prev, status: e.target.value as NewHealthRecord["status"] }))}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newRecord.description}
              onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Input
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
            />
          </div>
          <Button type="submit">Add Record</Button>
        </form>
      </CardContent>
    </Card>
  );
}
