import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Animal {
  id: string;
  tagNumber: string;
  breed: string;
  birthDate: string;
  gender: "male" | "female";
  status: "healthy" | "sick" | "quarantined";
  notes: string;
  createdBy: string;
  createdAt: number;
}

type NewAnimal = Omit<Animal, "id" | "createdBy" | "createdAt">;

export default function AnimalManagement() {
  const { user, role } = useAuthState();
  const [newAnimal, setNewAnimal] = useState<NewAnimal>({
    tagNumber: "",
    breed: "",
    birthDate: "",
    gender: "female",
    status: "healthy",
    notes: "",
  });

  const animalImages = [
    "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    "https://images.unsplash.com/photo-1438565434616-3ef039228b15",
    "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
    "https://images.unsplash.com/photo-1441057206919-63d19fac2369",
    "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2"
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * animalImages.length);
    return animalImages[randomIndex];
  };

  const { data: animals, isLoading, error } = useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      const animalsRef = collection(db, "animals");
      const q = query(animalsRef, orderBy("createdAt", "desc"));
      
      return new Promise<Animal[]>((resolve, reject) => {
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const animals = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Animal[];
            resolve(animals);
          },
          (error) => {
            toast.error("Error loading animals: " + error.message);
            reject(error);
          }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
      });
    },
  });

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add animals");
      return;
    }

    if (!newAnimal.tagNumber || !newAnimal.breed || !newAnimal.birthDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const animalData = {
        ...newAnimal,
        createdBy: user.uid,
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "animals"), animalData);
      setNewAnimal({
        tagNumber: "",
        breed: "",
        birthDate: "",
        gender: "female",
        status: "healthy",
        notes: "",
      });
      toast.success("Animal added successfully");
    } catch (error: any) {
      toast.error("Failed to add animal: " + error.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Animal["status"]) => {
    if (!user) {
      toast.error("You must be logged in to update animals");
      return;
    }

    try {
      await updateDoc(doc(db, "animals", id), { 
        status: newStatus,
        lastUpdatedBy: user.uid,
        lastUpdatedAt: Date.now(),
      });
      toast.success("Animal status updated");
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete animals");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    
    try {
      await deleteDoc(doc(db, "animals", id));
      toast.success("Animal deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete animal: " + error.message);
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center p-4">
          <h2 className="text-xl text-red-600">Error loading animals</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="relative">
          <img
            src={getRandomImage()}
            alt="Farm animals"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-lg flex items-center p-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Animal Management</h2>
              <p className="text-white/80 mt-2">Add and manage your farm animals</p>
            </div>
          </div>
        </div>

        {(role === "admin" || role === "veterinarian") && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Animal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnimal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tag Number</label>
                    <Input
                      value={newAnimal.tagNumber}
                      onChange={(e) => setNewAnimal(prev => ({ ...prev, tagNumber: e.target.value }))}
                      placeholder="Enter tag number"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Breed</label>
                    <Input
                      value={newAnimal.breed}
                      onChange={(e) => setNewAnimal(prev => ({ ...prev, breed: e.target.value }))}
                      placeholder="Enter breed"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Birth Date</label>
                    <Input
                      type="date"
                      value={newAnimal.birthDate}
                      onChange={(e) => setNewAnimal(prev => ({ ...prev, birthDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <select
                      className="w-full h-10 px-3 border rounded-md"
                      value={newAnimal.gender}
                      onChange={(e) => setNewAnimal(prev => ({ ...prev, gender: e.target.value as "male" | "female" }))}
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={newAnimal.notes}
                    onChange={(e) => setNewAnimal(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes"
                  />
                </div>
                <Button type="submit">Add Animal</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Animal List</CardTitle>
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
                      <th className="text-left p-2">Tag Number</th>
                      <th className="text-left p-2">Breed</th>
                      <th className="text-left p-2">Birth Date</th>
                      <th className="text-left p-2">Gender</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals?.map((animal) => (
                      <tr key={animal.id} className="border-b">
                        <td className="p-2">{animal.tagNumber}</td>
                        <td className="p-2">{animal.breed}</td>
                        <td className="p-2">{animal.birthDate}</td>
                        <td className="p-2">{animal.gender}</td>
                        <td className="p-2">
                          <select
                            value={animal.status}
                            onChange={(e) => handleUpdateStatus(animal.id, e.target.value as Animal["status"])}
                            className="p-1 rounded border"
                            disabled={role === "worker"}
                          >
                            <option value="healthy">Healthy</option>
                            <option value="sick">Sick</option>
                            <option value="quarantined">Quarantined</option>
                          </select>
                        </td>
                        <td className="p-2">
                          {(role === "admin" || role === "veterinarian") && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteAnimal(animal.id)}
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
      </div>
    </DashboardLayout>
  );
}
