
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MilkRecord } from "../types";

interface MilkTableProps {
  isLoading: boolean;
  milkRecords?: MilkRecord[];
  onDelete: (id: string) => void;
  canModify: boolean;
}

export const MilkTable = ({ isLoading, milkRecords, onDelete, canModify }: MilkTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Records</CardTitle>
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
                  <th className="text-left p-2">Animal ID</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Quantity (L)</th>
                  <th className="text-left p-2">Quality</th>
                  <th className="text-left p-2">Notes</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {milkRecords?.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="p-2">{record.animalId}</td>
                    <td className="p-2">{record.date}</td>
                    <td className="p-2">{record.quantity}</td>
                    <td className="p-2">Grade {record.quality}</td>
                    <td className="p-2">{record.notes}</td>
                    <td className="p-2">
                      {canModify && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(record.id)}
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
};
