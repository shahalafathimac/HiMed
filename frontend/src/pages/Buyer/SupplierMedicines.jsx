import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, ShoppingCart } from "lucide-react";
import { fetchSupplierDirectory } from "../../services/apiServices";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function SupplierMedicines() {
  const { supplierId } = useParams();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["supplierDirectory"],
    queryFn: async () => {
      const res = await fetchSupplierDirectory();
      return res.data;
    },
  });

  const supplier = suppliers.find((s) => String(s.id) === String(supplierId));

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/buyer/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-slate-500">Loading medicines...</div>
      )}

      {!isLoading && !supplier && (
        <div className="py-12 text-center text-slate-500">Supplier not found.</div>
      )}

      {!isLoading && supplier && (
        <>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{supplier.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {supplier.medicine_count} medicines · {supplier.total_stock} total stock
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {supplier.medicines.length === 0 && (
              <div className="col-span-full rounded-md border border-dashed py-12 text-center text-slate-500">
                This supplier has no medicines listed yet.
              </div>
            )}

            {supplier.medicines.map((medicine) => (
              <Card key={medicine.id} className="overflow-hidden">
                {/* Image */}
                <div className="h-48 w-full bg-slate-100">
                  {medicine.image_url ? (
                    <img
                      src={medicine.image_url}
                      alt={medicine.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImagePlus className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">{medicine.name}</CardTitle>
                    <Badge variant={medicine.stock < 10 ? "destructive" : "secondary"}>
                      {medicine.stock} stock
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {medicine.price && (
                    <p className="text-xl font-bold text-primary">{formatPrice(medicine.price)}</p>
                  )}
                  {medicine.expiry_date && (
                    <p className="text-xs text-slate-500">Expires {medicine.expiry_date}</p>
                  )}
                  <Button asChild className="w-full">
                    <Link to={`/buyer/medicines/${medicine.id}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View & Order
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}