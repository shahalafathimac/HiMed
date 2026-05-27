import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, Search } from "lucide-react";
import { fetchMedicinesList } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

function Medicines() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["buyerMedicines"],
    queryFn: async () => {
      const res = await fetchMedicinesList();
      return res.data;
    },
  });

  const filteredMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return medicines;

    return medicines.filter((medicine) =>
      [medicine.name, medicine.description, medicine.supplier_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [medicines, search]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse Medicines</h2>
          <p className="mt-1 text-sm text-slate-500">
            Medicines uploaded by verified suppliers.
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-11 pl-10"
            placeholder="Search medicines or suppliers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-slate-500">Loading medicines...</div>
      )}

      {!isLoading && filteredMedicines.length === 0 && (
        <div className="rounded-md border border-dashed py-12 text-center text-slate-500">
          No medicines found.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {!isLoading && filteredMedicines.map((medicine) => {
          const outOfStock = medicine.stock < 1;

          return (
            <Card
              key={medicine.id}
              className="flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md"
              onClick={() => navigate(`/buyer/medicines/${medicine.id}`)}
            >
              <div className="relative h-52 w-full bg-slate-100">
                {medicine.image_url ? (
                  <img
                    src={medicine.image_url}
                    alt={medicine.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <ImagePlus className="h-10 w-10" />
                  </div>
                )}
                <Badge className="absolute right-4 top-4" variant={outOfStock ? "destructive" : "secondary"}>
                  {outOfStock ? "Out of stock" : `${medicine.stock} in stock`}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 min-h-14 text-xl leading-7">
                  {medicine.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-2 text-2xl font-bold text-primary">{formatPrice(medicine.price)}</p>
                <p className="mb-2 text-xs text-slate-500">Expires {medicine.expiry_date}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Medicines;
