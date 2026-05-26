import { useQuery } from "@tanstack/react-query";
import { fetchMedicinesList } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImagePlus, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

export default function MedicinesCatalog() {
  const [search, setSearch] = useState("");

  const { data: medicines, isLoading, error } = useQuery({
    queryKey: ["publicMedicines"],
    queryFn: async () => {
      const res = await fetchMedicinesList();
      return res.data;
    },
    retry: false
  });

  const filtered = medicines?.filter(m => m.name.toLowerCase().includes(search.toLowerCase())) || [];
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Medicines Catalog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our extensive catalog of high-quality medical supplies from verified suppliers.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input 
            className="pl-10 h-12 text-lg rounded-full bg-white dark:bg-slate-900 shadow-sm"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
              <p className="text-slate-600 mb-6">You must be logged in to view the full live catalog and pricing details.</p>
              <Button asChild><Link to="/login">Log In to View</Link></Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(med => (
              <Card key={med.id} className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
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
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{med.name}</CardTitle>
                    <Badge variant="secondary" className="text-sm font-bold">{formatPrice(med.price)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{med.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Stock: {med.stock > 0 ? med.stock : <span className="text-red-500">Out of Stock</span>}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/login">Order Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
