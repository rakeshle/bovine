
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, UserCog, Users } from "lucide-react";

interface UserStatsProps {
  adminCount: number;
  veterinarianCount: number;
  workerCount: number;
}

export const UserStats = ({ adminCount, veterinarianCount, workerCount }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Admins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adminCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Veterinarians
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{veterinarianCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Workers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workerCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};
