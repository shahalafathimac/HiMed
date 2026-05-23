import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchMedicinesList, createMedicine, deleteMedicine, updateMedicine } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";

const medicineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Provide a better description"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid price required"),
  stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Valid stock required"),
});

export default function MyMedicines() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const { data: medicines, isLoading } = useQuery({
    queryKey: ["supplierMedicines"],
    queryFn: async () => {
      const res = await fetchMedicinesList();
      return res.data;
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(medicineSchema)
  });

  const createMutation = useMutation({
    mutationFn: (data) => createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      setShowForm(false);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMedicine(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] })
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateMedicine(editingMedicine.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      setShowForm(false);
      setEditingMedicine(null);
      reset();
    }
  });

  const onSubmit = (data) => {
    if (editingMedicine) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">My Medicines Inventory</h2>
        <Button onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingMedicine(null);
            reset();
          }
        }}>
          <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancel" : "Add Medicine"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>{editingMedicine ? "Edit Medicine" : "Add New Medicine"}</CardTitle>
            <CardDescription>{editingMedicine ? "Update your product listing." : "List a new product in the marketplace."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  {...register("description")}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Medicine"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <div className="text-center py-12 text-slate-500">Loading inventory...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!isLoading && medicines?.map((med) => (
          <Card key={med.id} className="group relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl pr-8">{med.name}</CardTitle>
                <Badge variant={med.stock < 10 ? "destructive" : "secondary"} className="absolute top-6 right-6">
                  {med.stock} in stock
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">${med.price}</p>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{med.description}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditingMedicine(med);
                    reset({
                      name: med.name,
                      price: med.price.toString(),
                      stock: med.stock.toString(),
                      description: med.description
                    });
                    setShowForm(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    if (window.confirm("Delete this medicine?")) deleteMutation.mutate(med.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && medicines?.length === 0 && !showForm && (
          <div className="col-span-full text-center py-12 text-slate-500 border rounded-xl border-dashed">
            You haven't listed any medicines yet.
          </div>
        )}
      </div>
    </div>
  );
}
