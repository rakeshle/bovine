
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Stethoscope, Syringe, Heart } from "lucide-react";
import type { HealthRecord } from "../types";

interface HealthStatsProps {
  healthRecords: HealthRecord[] | undefined;
}

export function HealthStats({ healthRecords }: HealthStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Checkups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {healthRecords?.filter(r => r.type === "checkup").length || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Vaccinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {healthRecords?.filter(r => r.type === "vaccination").length || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Treatments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {healthRecords?.filter(r => r.type === "treatment").length || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
