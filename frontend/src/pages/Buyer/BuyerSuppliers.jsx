import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PackageCheck, Search, Store } from "lucide-react";
import { fetchSupplierDirectory } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function BuyerSuppliers() {
  const [search, setSearch] = useState("");

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["supplierDirectory"],
    queryFn: async () => {
      const res = await fetchSupplierDirectory();
      return res.data;
    },
  });

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return suppliers;

    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.medicines.some((medicine) => medicine.name.toLowerCase().includes(term))
    );
  }, [search, suppliers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="mt-1 text-sm text-slate-500">
            Registered suppliers and their listed medicines.
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-11 pl-10"
            placeholder="Search suppliers or medicines..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-slate-500">Loading suppliers...</div>
      )}

      {!isLoading && filteredSuppliers.length === 0 && (
        <div className="rounded-md border border-dashed py-12 text-center text-slate-500">
          No suppliers found.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {!isLoading && filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      {supplier.medicine_count} listed medicines
                    </p>
                  </div>
                </div>
                <Badge variant={supplier.low_stock_count > 0 ? "destructive" : "secondary"}>
                  {supplier.low_stock_count > 0 ? `${supplier.low_stock_count} low stock` : "Available"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Total Stock</p>
                  <p className="mt-1 text-lg font-bold">{supplier.total_stock}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Medicines</p>
                  <p className="mt-1 text-lg font-bold">{supplier.medicine_count}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sample Medicines
                </p>
                <div className="space-y-2">
                  {supplier.medicines.length === 0 && (
                    <p className="text-sm text-slate-500">No medicines uploaded yet.</p>
                  )}
                  {supplier.medicines.map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="line-clamp-1">{medicine.name}</span>
                      <span className="text-xs text-slate-500">{medicine.stock} stock</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to={`/buyer/suppliers/${supplier.id}/medicines`}>
                  <PackageCheck className="mr-2 h-4 w-4" />
                  View Medicines
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
