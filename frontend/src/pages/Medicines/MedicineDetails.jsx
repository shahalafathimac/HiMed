import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Minus, Plus, ShoppingCart } from "lucide-react";
import { addCartItem, fetchMedicinesList, placeOrder } from "../../services/apiServices";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["buyerMedicines"],
    queryFn: async () => {
      const res = await fetchMedicinesList();
      return res.data;
    },
  });

  const medicine = useMemo(
    () => medicines.find((item) => String(item.id) === String(id)),
    [medicines, id]
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  const updateQuantity = (nextQuantity) => {
    if (!medicine) return;
    const maxQuantity = Math.max(Number(medicine.stock || 0), 1);
    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity));
  };

  const handleBuyNow = async () => {
    if (!medicine || medicine.stock < 1) return;

    try {
      setIsOrdering(true);
      await placeOrder({ medicine_id: medicine.id, quantity });
      queryClient.invalidateQueries({ queryKey: ["buyerMedicines"] });
      alert("Order placed successfully!");
      navigate("/buyer/orders");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsOrdering(false);
    }
  };

  const handleAddToCart = async () => {
    if (!medicine || medicine.stock < 1) return;

    try {
      setIsAddingToCart(true);
      await addCartItem({
        medicine_id: medicine.id,
        quantity,
      });
      queryClient.invalidateQueries({ queryKey: ["buyerCart"] });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Loading medicine details...</div>;
  }

  if (!medicine) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link to="/buyer/medicines">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="rounded-md border border-dashed py-12 text-center text-slate-500">
          Medicine not found.
        </div>
      </div>
    );
  }

  const outOfStock = medicine.stock < 1;
  const totalPrice = Number(medicine.price || 0) * quantity;

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link to="/buyer/medicines">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medicines
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <div className="overflow-hidden rounded-md border bg-white dark:bg-slate-900">
          <div className="aspect-[4/3] w-full bg-slate-100">
            {medicine.image_url ? (
              <img
                src={medicine.image_url}
                alt={medicine.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImagePlus className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={outOfStock ? "destructive" : "secondary"}>
                {outOfStock ? "Out of stock" : `${medicine.stock} in stock`}
              </Badge>
              {medicine.supplier_name && (
                <Badge variant="outline">Supplier: {medicine.supplier_name}</Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{medicine.name}</h2>
            <p className="mt-3 text-3xl font-bold text-primary">{formatPrice(medicine.price)}</p>
            <p className="mt-2 text-sm text-slate-500">Expires {medicine.expiry_date}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Description</h3>
            <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
              {medicine.description}
            </p>
          </div>

          <div className="rounded-md border bg-white p-4 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Quantity</span>
              <div className="flex items-center rounded-md border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={outOfStock || quantity <= 1}
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={outOfStock || quantity >= medicine.stock}
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Total</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                disabled={outOfStock || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                type="button"
                disabled={outOfStock || isOrdering}
                onClick={handleBuyNow}
              >
                {isOrdering ? "Ordering..." : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;
