
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wheat, Scale, Package } from "lucide-react";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { FeedRecord, NewFeedRecord, NutritionSchedule, NewNutritionSchedule } from "./types";

export default function FeedManagement() {
  const { user, role } = useAuthState();
  const [newFeed, setNewFeed] = useState<NewFeedRecord>({
    name: "",
    stock: 0,
    status: "Good",
    lastUpdated: new Date().toISOString().split('T')[0],
    nutritionalValue: "",
  });

  const [newSchedule, setNewSchedule] = useState<NewNutritionSchedule>({
    time: "",
    type: "",
    quantity: "",
    herdSize: 0,
  });

  const { data: feedRecords, isLoading: isLoadingFeeds } = useQuery({
    queryKey: ["feedRecords"],
    queryFn: async () => {
      const recordsRef = collection(db, "feedRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise<FeedRecord[]>((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FeedRecord[];
          resolve(records);
        });
      });
    },
  });

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["nutritionSchedules"],
    queryFn: async () => {
      const schedulesRef = collection(db, "nutritionSchedules");
      const q = query(schedulesRef, orderBy("createdAt", "desc"));
      
      return new Promise<NutritionSchedule[]>((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as NutritionSchedule[];
          resolve(records);
        });
      });
    },
  });

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add feed records");
      return;
    }

    try {
      const feedData = {
        ...newFeed,
        createdBy: user.uid,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "feedRecords"), feedData);
      setNewFeed({
        name: "",
        stock: 0,
        status: "Good",
        lastUpdated: new Date().toISOString().split('T')[0],
        nutritionalValue: "",
      });
      toast.success("Feed record added successfully");
    } catch (error: any) {
      toast.error("Failed to add feed record: " + error.message);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add schedules");
      return;
    }

    try {
      const scheduleData = {
        ...newSchedule,
        createdBy: user.uid,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "nutritionSchedules"), scheduleData);
      setNewSchedule({
        time: "",
        type: "",
        quantity: "",
        herdSize: 0,
      });
      toast.success("Feeding schedule added successfully");
    } catch (error: any) {
      toast.error("Failed to add schedule: " + error.message);
    }
  };

  const handleDeleteFeed = async (id: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this feed record?")) return;
    
    try {
      await deleteDoc(doc(db, "feedRecords", id));
      toast.success("Feed record deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete record: " + error.message);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this schedule?")) return;
    
    try {
      await deleteDoc(doc(db, "nutritionSchedules", id));
      toast.success("Schedule deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete schedule: " + error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-bold">Feed Management</h2>
          <p className="text-muted-foreground mt-2">Track feed inventory and schedules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {feedRecords?.map((feed) => (
            <Card key={feed.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{feed.name}</CardTitle>
                <Wheat className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{feed.stock} kg</p>
                  <p className={`text-sm ${
                    feed.status === "Good" 
                      ? "text-green-600 dark:text-green-400"
                      : feed.status === "Low"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    Status: {feed.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {feed.lastUpdated}
                  </p>
                  {(role === "admin" || role === "worker") && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteFeed(feed.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(role === "admin" || role === "worker") && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Add Feed Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddFeed} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Feed Name</label>
                        <Input
                          value={newFeed.name}
                          onChange={(e) => setNewFeed(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter feed name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stock (kg)</label>
                        <Input
                          type="number"
                          value={newFeed.stock}
                          onChange={(e) => setNewFeed(prev => ({ ...prev, stock: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                          className="w-full h-10 px-3 border rounded-md"
                          value={newFeed.status}
                          onChange={(e) => setNewFeed(prev => ({ ...prev, status: e.target.value as FeedRecord["status"] }))}
                        >
                          <option value="Good">Good</option>
                          <option value="Low">Low</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nutritional Value</label>
                        <Input
                          value={newFeed.nutritionalValue}
                          onChange={(e) => setNewFeed(prev => ({ ...prev, nutritionalValue: e.target.value }))}
                          placeholder="Enter nutritional value"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Feed Record</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Feeding Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddSchedule} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                          type="time"
                          value={newSchedule.time}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Input
                          value={newSchedule.type}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="Enter feed type"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <Input
                          value={newSchedule.quantity}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, quantity: e.target.value }))}
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Herd Size</label>
                        <Input
                          type="number"
                          value={newSchedule.herdSize}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, herdSize: Number(e.target.value) }))}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">Add Schedule</Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Feeding Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules?.map((schedule) => (
                  <div key={schedule.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Scale className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{schedule.type} - {schedule.time}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {schedule.quantity}</p>
                      <p className="text-sm text-muted-foreground">Herd Size: {schedule.herdSize} animals</p>
                    </div>
                    {(role === "admin" || role === "worker") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
