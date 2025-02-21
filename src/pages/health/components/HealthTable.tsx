
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import type { HealthRecord } from "../types";

interface HealthTableProps {
  healthRecords: HealthRecord[] | undefined;
  isLoading: boolean;
  role?: string;
  onDelete?: (id: string) => Promise<void>;
}

export function HealthTable({ healthRecords, isLoading, role, onDelete }: HealthTableProps) {
  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await deleteDoc(doc(db, "healthRecords", id));
      toast.success("Record deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete record: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Records</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Animal Tag</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords?.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="p-2">{record.animalTagNumber}</td>
                    <td className="p-2 capitalize">{record.type}</td>
                    <td className="p-2">{record.date}</td>
                    <td className="p-2 capitalize">{record.status}</td>
                    <td className="p-2">{record.description}</td>
                    <td className="p-2">
                      {(role === "admin" || role === "veterinarian") && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
