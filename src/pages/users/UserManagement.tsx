
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserStats } from "./components/UserStats";
import { UserTable } from "./components/UserTable";
import type { User } from "./types";

export default function UserManagement() {
  const { user, role } = useAuthState();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      
      return new Promise<User[]>((resolve) => {
        onSnapshot(q, (snapshot) => {
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as User[];
          resolve(users);
        });
      });
    },
  });

  const handleUpdateRole = async (userId: string, newRole: User["role"]) => {
    if (role !== "admin") {
      toast.error("Only admins can update user roles");
      return;
    }

    if (userId === user?.uid) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      toast.success("User role updated successfully");
    } catch (error: any) {
      toast.error("Failed to update user role: " + error.message);
    }
  };

  const getRoleCount = (roleType: User["role"]) => {
    return users?.filter(u => u.role === roleType).length || 0;
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeIn space-y-6">
        <UserStats 
          adminCount={getRoleCount("admin")}
          veterinarianCount={getRoleCount("veterinarian")}
          workerCount={getRoleCount("worker")}
        />

        <UserTable 
          users={users}
          isLoading={isLoading}
          isAdmin={role === "admin"}
          currentUserId={user?.uid}
          onUpdateRole={handleUpdateRole}
        />
      </div>
    </DashboardLayout>
  );
}
