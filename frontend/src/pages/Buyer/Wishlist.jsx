import { Link } from "react-router-dom";
import { Heart, ImagePlus, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import useWishlist from "../../hooks/useWishlist";

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wishlist</h2>
        <p className="mt-1 text-sm text-slate-500">
          Save medicines you want to order later.
        </p>
      </div>

      {items.length === 0 && (
        <div className="rounded-md border border-dashed py-12 text-center text-slate-500">
          No medicines in your wishlist.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((medicine) => {
          const outOfStock = medicine.stock < 1;

          return (
            <Card key={medicine.id} className="flex h-full flex-col overflow-hidden">
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-4 rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white hover:text-red-600"
                  onClick={() => toggleWishlist(medicine)}
                  title="Remove from wishlist"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
                <Badge className="absolute right-4 top-4" variant={outOfStock ? "destructive" : "secondary"}>
                  {outOfStock ? "Out of stock" : `${medicine.stock} in stock`}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 min-h-14 text-xl leading-7">
                  {medicine.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <p className="mb-2 text-2xl font-bold text-primary">{formatPrice(medicine.price)}</p>
                <p className="mb-4 text-xs text-slate-500">Expires {medicine.expiry_date}</p>
                <Button asChild className="mt-auto w-full">
                  <Link to={`/buyer/medicines/${medicine.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View & Order
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
