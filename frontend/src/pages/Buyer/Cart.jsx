import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { checkoutCart, fetchCart, removeCartItem, updateCartItem } from "../../services/apiServices";

function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["buyerCart"],
    queryFn: fetchCart,
  });

  const cart = cartResponse?.data;
  const items = useMemo(() => cart?.items || [], [cart?.items]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price || 0));

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buyerCart"] }),
    onError: (err) => alert(err.response?.data?.message || "Failed to update cart"),
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buyerCart"] }),
    onError: (err) => alert(err.response?.data?.message || "Failed to remove item"),
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerCart"] });
      queryClient.invalidateQueries({ queryKey: ["buyerMedicines"] });
      alert("Checkout completed");
      navigate("/buyer/orders");
    },
    onError: (err) => alert(err.response?.data?.message || "Checkout failed"),
  });

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  );
  const shipping = items.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Loading cart...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Review your selections
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight">Your Shopping Bag</h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed bg-white py-16 text-center dark:bg-slate-900">
          <ShoppingCart className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <p className="text-lg font-semibold">Your cart is empty.</p>
          <Button className="mt-5" asChild>
            <Link to="/buyer/medicines">Browse Medicines</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_120px] border-b pb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              <span>Item Details</span>
              <span className="text-right">Action</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-md border bg-white p-4 dark:bg-slate-900 md:grid-cols-[120px_1fr_120px]">
                <div className="h-28 w-28 overflow-hidden rounded-md bg-slate-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImagePlus className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{formatPrice(item.price)}</p>
                  {item.supplier_name && (
                    <p className="mt-1 text-xs text-slate-500">Supplier: {item.supplier_name}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">Available stock: {item.stock}</p>

                  <div className="mt-4 inline-flex items-center rounded-md border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={item.quantity <= 1 || updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 })}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={item.quantity >= item.stock || updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={removeMutation.isPending}
                    onClick={() => removeMutation.mutate(item.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="ghost" asChild>
              <Link to="/buyer/medicines">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Medicines
              </Link>
            </Button>
          </div>

          <div className="h-fit rounded-md border bg-white p-6 dark:bg-slate-900">
            <h3 className="text-2xl font-bold">Order Summary</h3>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Secured Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending ? "Checking out..." : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
