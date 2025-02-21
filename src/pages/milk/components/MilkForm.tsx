
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewMilkRecord } from "../types";

interface MilkFormProps {
  newRecord: NewMilkRecord;
  setNewRecord: (record: NewMilkRecord) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MilkForm = ({ newRecord, setNewRecord, onSubmit }: MilkFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Production Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Animal ID</label>
              <Input
                value={newRecord.animalId}
                onChange={(e) => setNewRecord({ ...newRecord, animalId: e.target.value })}
                placeholder="Enter animal ID"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity (L)</label>
              <Input
                type="number"
                step="0.1"
                value={newRecord.quantity}
                onChange={(e) => setNewRecord({ ...newRecord, quantity: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quality</label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={newRecord.quality}
                onChange={(e) => setNewRecord({ ...newRecord, quality: e.target.value as "A" | "B" | "C" })}
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Input
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              placeholder="Additional notes"
            />
          </div>
          <Button type="submit">Add Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};
