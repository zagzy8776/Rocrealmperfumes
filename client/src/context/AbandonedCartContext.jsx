import { createContext, useContext, useEffect, useState } from 'react';

const AbandonedCartContext = createContext();

const STORAGE_KEY = 'roc_realm_abandoned_cart';
const ABANDON_THRESHOLD = 30 * 60 * 1000; // 30 minutes

export const AbandonedCartProvider = ({ children }) => {
  const [abandonedCarts, setAbandonedCarts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAbandonedCarts(JSON.parse(stored));
      } catch {
        setAbandonedCarts([]);
      }
    }
  }, []);

  const trackAbandonedCart = (cartItems, customerInfo = {}) => {
    if (!cartItems || cartItems.length === 0) return;

    const abandonedCart = {
      id: Date.now(),
      items: cartItems,
      customer: customerInfo,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      timestamp: new Date().toISOString(),
      recovered: false,
    };

    setAbandonedCarts((prev) => {
      const updated = [abandonedCart, ...prev].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Send to backend for tracking
    if (typeof window !== 'undefined' && window.api) {
      window.api.post('/abandoned-carts', abandonedCart).catch(() => {});
    }
  };

  const markAsRecovered = (id) => {
    setAbandonedCarts((prev) => {
      const updated = prev.map((cart) =>
        cart.id === id ? { ...cart, recovered: true } : cart
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearOldCarts = () => {
    const now = Date.now();
    setAbandonedCarts((prev) => {
      const filtered = prev.filter(
        (cart) => now - new Date(cart.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000 // Keep only last 7 days
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  // Clean up old carts on mount
  useEffect(() => {
    clearOldCarts();
  }, []);

  return (
    <AbandonedCartContext.Provider
      value={{
        abandonedCarts,
        trackAbandonedCart,
        markAsRecovered,
        clearOldCarts,
      }}
    >
      {children}
    </AbandonedCartContext.Provider>
  );
};

export const useAbandonedCart = () => {
  const context = useContext(AbandonedCartContext);
  if (!context) {
    throw new Error('useAbandonedCart must be used within AbandonedCartProvider');
  }
  return context;
};
