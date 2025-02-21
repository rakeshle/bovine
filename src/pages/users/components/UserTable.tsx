
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "../types";

interface UserTableProps {
  users?: User[];
  isLoading: boolean;
  isAdmin: boolean;
  currentUserId?: string;
  onUpdateRole: (userId: string, newRole: User["role"]) => void;
}

export const UserTable = ({ users, isLoading, isAdmin, currentUserId, onUpdateRole }: UserTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
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
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Current Role</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2 capitalize">{user.role}</td>
                    <td className="p-2">
                      {isAdmin && user.id !== currentUserId && (
                        <select
                          className="p-1 rounded border"
                          value={user.role}
                          onChange={(e) => onUpdateRole(user.id, e.target.value as User["role"])}
                        >
                          <option value="admin">Admin</option>
                          <option value="veterinarian">Veterinarian</option>
                          <option value="worker">Worker</option>
                        </select>
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
