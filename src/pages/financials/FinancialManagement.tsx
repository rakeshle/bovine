
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, TrendingUp, TrendingDown, Receipt, PiggyBank, Wallet } from "lucide-react";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { FinancialRecord, NewFinancialRecord } from "./types";

export default function FinancialManagement() {
  const { user, role } = useAuthState();
  const [newRecord, setNewRecord] = useState<NewFinancialRecord>({
    description: "",
    amount: 0,
    date: "",
    type: "income",
    category: "",
  });

  const { data: financialRecords, isLoading } = useQuery({
    queryKey: ["financialRecords"],
    queryFn: async () => {
      const recordsRef = collection(db, "financialRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise<FinancialRecord[]>((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FinancialRecord[];
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

      await addDoc(collection(db, "financialRecords"), recordData);
      setNewRecord({
        description: "",
        amount: 0,
        date: "",
        type: "income",
        category: "",
      });
      toast.success("Financial record added successfully");
    } catch (error: any) {
      toast.error("Failed to add record: " + error.message);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await deleteDoc(doc(db, "financialRecords", id));
      toast.success("Record deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete record: " + error.message);
    }
  };

  const calculateMetrics = () => {
    if (!financialRecords) return {
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      netProfit: 0,
      outstandingBills: 0,
    };

    const currentMonth = new Date().getMonth();
    const monthlyRecords = financialRecords.filter(
      record => new Date(record.date).getMonth() === currentMonth
    );

    const monthlyRevenue = monthlyRecords
      .filter(record => record.type === "income")
      .reduce((sum, record) => sum + record.amount, 0);

    const monthlyExpenses = monthlyRecords
      .filter(record => record.type === "expense")
      .reduce((sum, record) => sum + record.amount, 0);

    return {
      monthlyRevenue,
      monthlyExpenses,
      netProfit: monthlyRevenue - monthlyExpenses,
      outstandingBills: monthlyExpenses * 0.2, // Example calculation
    };
  };

  const metrics = calculateMetrics();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-bold">Financial Management</h2>
          <p className="text-muted-foreground mt-2">Track revenue and expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">${metrics.monthlyRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">${metrics.monthlyExpenses.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <PiggyBank className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">${metrics.netProfit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Bills</CardTitle>
              <Receipt className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">${metrics.outstandingBills.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {(role === "admin") && (
          <Card>
            <CardHeader>
              <CardTitle>Add Financial Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newRecord.amount}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      required
                    />
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
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full h-10 px-3 border rounded-md"
                      value={newRecord.type}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value as "income" | "expense" }))}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newRecord.category}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Enter category"
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Add Record</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialRecords?.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{record.description}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                    <p className="text-sm text-muted-foreground">Category: {record.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-medium ${
                      record.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {record.type === "income" ? "+" : "-"}${record.amount.toFixed(2)}
                    </p>
                    {role === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
