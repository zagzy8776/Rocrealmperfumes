import { createContext, useContext, useState, useEffect } from 'react';

const ProductComparisonContext = createContext();

const STORAGE_KEY = 'roc_realm_product_comparison';
const MAX_COMPARE = 4;

export const ProductComparisonProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCompareList(JSON.parse(stored));
      } catch {
        setCompareList([]);
      }
    }
  }, []);

  const addToCompare = (product) => {
    if (!product || !product.id) return;
    
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      
      const updated = [...prev, product].slice(0, MAX_COMPARE);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProductComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        canAdd: compareList.length < MAX_COMPARE,
      }}
    >
      {children}
    </ProductComparisonContext.Provider>
  );
};

export const useProductComparison = () => {
  const context = useContext(ProductComparisonContext);
  if (!context) {
    throw new Error('useProductComparison must be used within ProductComparisonProvider');
  }
  return context;
};
