import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Baby,
  HeartPulse,
  Milk,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Wheat,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import type { Animal } from "@/pages/animals/types";
import type { HealthRecord } from "@/pages/health/types";
import type { MilkRecord } from "@/pages/milk/types";
import type { FinancialRecord } from "@/pages/financials/types";

export default function Index() {
  const [stats, setStats] = useState([
    {
      title: "Total Animals",
      value: "0",
      icon: Baby,
      trend: "Loading...",
      trendUp: true,
      image: "https://images.unsplash.com/photo-1597645507412-3461834d4e4f",
    },
    {
      title: "Milk Production",
      value: "0L",
      icon: Milk,
      trend: "Loading...",
      trendUp: true,
      image: "https://images.unsplash.com/photo-1545468258-ef5f92c93efd",
    },
    {
      title: "Health Alerts",
      value: "0",
      icon: HeartPulse,
      trend: "Loading...",
      trendUp: false,
      image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8",
    },
    {
      title: "Monthly Revenue",
      value: "$0",
      icon: DollarSign,
      trend: "Loading...",
      trendUp: true,
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
    },
  ]);

  const [alerts, setAlerts] = useState([]);

  // Fetch animals data
  const { data: animals } = useQuery<Animal[]>({
    queryKey: ["animals"],
    queryFn: () => {
      const animalsRef = collection(db, "animals");
      const q = query(animalsRef, orderBy("createdAt", "desc"));
      
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const animals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Animal[];
          resolve(animals);
        });
      });
    },
  });

  // Fetch milk records
  const { data: milkRecords } = useQuery<MilkRecord[]>({
    queryKey: ["milkRecords"],
    queryFn: () => {
      const recordsRef = collection(db, "milkRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as MilkRecord[];
          resolve(records);
        });
      });
    },
  });

  // Fetch health records
  const { data: healthRecords } = useQuery<HealthRecord[]>({
    queryKey: ["healthRecords"],
    queryFn: () => {
      const recordsRef = collection(db, "healthRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as HealthRecord[];
          resolve(records);
        });
      });
    },
  });

  // Fetch financial records
  const { data: financialRecords } = useQuery<FinancialRecord[]>({
    queryKey: ["financialRecords"],
    queryFn: () => {
      const recordsRef = collection(db, "financialRecords");
      const q = query(recordsRef, orderBy("createdAt", "desc"));
      
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as FinancialRecord[];
          resolve(records);
        });
      });
    },
  });

  // Update stats based on real-time data
  useEffect(() => {
    if (animals && milkRecords && healthRecords && financialRecords) {
      const currentMonth = new Date().getMonth();
      
      // Calculate monthly income
      const monthlyIncome = financialRecords
        .filter(record => new Date(record.date).getMonth() === currentMonth && record.type === "income")
        .reduce((sum, record) => sum + record.amount, 0);

      // Calculate milk production total
      const totalMilk = milkRecords
        .filter(record => new Date(record.date).getMonth() === currentMonth)
        .reduce((sum, record) => sum + record.quantity, 0);

      // Count health alerts
      const activeAlerts = healthRecords
        .filter(record => record.status === "sick" || record.status === "quarantined")
        .length;

      setStats([
        {
          title: "Total Animals",
          value: animals.length.toString(),
          icon: Baby,
          trend: `${animals.filter(a => new Date(a.createdAt).getMonth() === currentMonth).length} this month`,
          trendUp: true,
          image: "https://images.unsplash.com/photo-1597645507412-3461834d4e4f",
        },
        {
          title: "Milk Production",
          value: `${totalMilk.toFixed(1)}L`,
          icon: Milk,
          trend: "This month",
          trendUp: true,
          image: "https://images.unsplash.com/photo-1545468258-ef5f92c93efd",
        },
        {
          title: "Health Alerts",
          value: activeAlerts.toString(),
          icon: HeartPulse,
          trend: `${activeAlerts} requiring attention`,
          trendUp: false,
          image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8",
        },
        {
          title: "Monthly Revenue",
          value: `$${monthlyIncome.toFixed(2)}`,
          icon: DollarSign,
          trend: "This month",
          trendUp: true,
          image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
        },
      ]);

      // Update alerts
      const newAlerts = [
        ...healthRecords
          .filter(record => record.status === "sick" || record.status === "quarantined")
          .slice(0, 2)
          .map(record => ({
            title: "Health Alert",
            description: `Animal #${record.animalId} needs attention`,
            type: "error",
          })),
        ...animals
          .filter(animal => animal.status === "sick")
          .slice(0, 2)
          .map(animal => ({
            title: "Animal Health Check Required",
            description: `${animal.tagNumber} needs medical attention`,
            type: "warning",
          })),
      ];

      setAlerts(newAlerts);
    }
  }, [animals, milkRecords, healthRecords, financialRecords]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        <div className="relative rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1597645507412-3461834d4e4f"
            alt="Dairy farm header"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Dashboard</h2>
              <p className="text-white/80 mt-2">Monitor your farm's performance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <div className="relative h-32">
                <img
                  src={stat.image}
                  alt={stat.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    stat.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      alert.type === "warning"
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm opacity-90">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-16 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
