import { useEffect, useMemo, useState } from "react";

const WISHLIST_KEY = "himed-wishlist";

const readWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

export function useWishlist() {
  const [items, setItems] = useState(readWishlist);

  useEffect(() => {
    const syncWishlist = (event) => setItems(event.detail || readWishlist());
    window.addEventListener("storage", syncWishlist);
    window.addEventListener("himed-wishlist-updated", syncWishlist);
    return () => {
      window.removeEventListener("storage", syncWishlist);
      window.removeEventListener("himed-wishlist-updated", syncWishlist);
    };
  }, []);

  const itemIds = useMemo(
    () => new Set(items.map((item) => String(item.id))),
    [items]
  );

  const isWishlisted = (medicineId) => itemIds.has(String(medicineId));

  const toggleWishlist = (medicine) => {
    setItems((currentItems) => {
      const exists = currentItems.some((item) => String(item.id) === String(medicine.id));
      const nextItems = exists
        ? currentItems.filter((item) => String(item.id) !== String(medicine.id))
        : [
            ...currentItems,
            {
              id: medicine.id,
              name: medicine.name,
              price: medicine.price,
              stock: medicine.stock,
              expiry_date: medicine.expiry_date,
              image_url: medicine.image_url,
              supplier_name: medicine.supplier_name,
            },
          ];

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextItems));
      window.dispatchEvent(new CustomEvent("himed-wishlist-updated", { detail: nextItems }));
      return nextItems;
    });
  };

  return {
    items,
    isWishlisted,
    toggleWishlist,
  };
}

export default useWishlist;
