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
import { CheckCircle2, ImagePlus, Plus, Trash2, Edit, X } from "lucide-react";

const medicineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Provide a better description"),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Valid price required"),
  stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Valid stock required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  image: z.any().optional(),
});

const emptyMedicineForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  expiry_date: "",
  image: undefined,
};

export default function MyMedicines() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const { data: medicines, isLoading } = useQuery({
    queryKey: ["supplierMedicines"],
    queryFn: async () => {
      const res = await fetchMedicinesList();
      return res.data;
    }
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: emptyMedicineForm,
  });

  const clearForm = () => {
    reset(emptyMedicineForm);
    setUploadedImageName("");
    setUploadInputKey((key) => key + 1);
  };

  const createMutation = useMutation({
    mutationFn: (data) => createMedicine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierMedicines"] });
      setShowForm(false);
      setEditingMedicine(null);
      clearForm();
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
      clearForm();
    }
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("expiry_date", data.expiry_date);

    const imageFile = data.image?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editingMedicine) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">My Medicines Inventory</h2>
        <Button onClick={() => {
          const nextShowForm = !showForm;
          setShowForm(nextShowForm);
          if (!nextShowForm || editingMedicine) {
            setEditingMedicine(null);
            clearForm();
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
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" step="0.01" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Initial Stock</Label>
                  <Input id="stock" type="number" {...register("stock")} />
                  {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input id="expiry_date" type="date" {...register("expiry_date")} />
                  {errors.expiry_date && <p className="text-xs text-destructive">{errors.expiry_date.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Medicine Image</Label>
                <label
                  htmlFor="image"
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background/40 px-4 py-5 text-center text-sm text-muted-foreground transition-colors hover:bg-accent"
                >
                  <ImagePlus className="mb-2 h-6 w-6 text-primary" />
                  Upload medicine image
                  <Input
                    key={uploadInputKey}
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...register("image", {
                      onChange: (event) => {
                        setUploadedImageName(event.target.files?.[0]?.name || "");
                      },
                    })}
                  />
                </label>
                {uploadedImageName && (
                  <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Uploaded: {uploadedImageName}</span>
                  </div>
                )}
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
          <Card
            key={med.id}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden"
            onClick={() => setSelectedMedicine(med)}
          >
            <div className="h-56 w-full bg-slate-100">
              {med.image_url ? (
                <img
                  src={med.image_url}
                  alt={med.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <ImagePlus className="h-10 w-10" />
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-2 min-h-14 text-xl leading-7 pr-8">{med.name}</CardTitle>
                <Badge variant={med.stock < 10 ? "destructive" : "secondary"} className="absolute top-6 right-6">
                  {med.stock} in stock
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-2xl font-bold text-primary mb-2">{formatPrice(med.price)}</p>
              <p className="text-xs text-slate-500 mb-2">Expires {med.expiry_date}</p>
              <div className="mt-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditingMedicine(med);
                    reset({
                      name: med.name,
                      price: med.price.toString(),
                      stock: med.stock.toString(),
                      expiry_date: med.expiry_date,
                      description: med.description,
                      image: undefined
                    });
                    setUploadedImageName("");
                    setUploadInputKey((key) => key + 1);
                    setShowForm(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={(event) => {
                    event.stopPropagation();
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

      {selectedMedicine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedMedicine(null)}
        >
          <div
            className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedMedicine.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {formatPrice(selectedMedicine.price)} · Expires {selectedMedicine.expiry_date}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSelectedMedicine(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
              {selectedMedicine.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
