import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rrp_wishlist')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rrp_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((product) => {
    if (!product?.id) return;
    setItems((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0],
          price: Number(product.salePrice || product.price),
          category: product.category?.name,
        },
      ];
    });
  }, []);

  const isWishlisted = useCallback((id) => items.some((item) => item.id === id), [items]);
  const clearWishlist = useCallback(() => setItems([]), []);
  const count = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, count, toggleWishlist, isWishlisted, clearWishlist }),
    [items, count, toggleWishlist, isWishlisted, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
