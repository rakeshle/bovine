
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Milk, TrendingUp, Calculator } from "lucide-react";

interface MilkStatsProps {
  totalProduction: number;
  averageQuality: number;
  totalRecords: number;
}

export const MilkStats = ({ totalProduction, averageQuality, totalRecords }: MilkStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Milk className="h-5 w-5" />
            Total Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProduction.toFixed(2)} L</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quality Grade A
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageQuality.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Total Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
        </CardContent>
      </Card>
    </div>
  );
};
