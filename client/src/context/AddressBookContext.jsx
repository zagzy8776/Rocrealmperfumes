import { createContext, useContext, useState, useEffect } from 'react';

const AddressBookContext = createContext();

const STORAGE_KEY = 'roc_realm_address_book';

export const AddressBookProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAddresses(JSON.parse(stored));
      } catch {
        setAddresses([]);
      }
    }
  }, []);

  const addAddress = (address) => {
    if (!address || !address.name) return;

    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: addresses.length === 0,
      createdAt: new Date().toISOString(),
    };

    setAddresses((prev) => {
      const updated = [...prev, newAddress];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateAddress = (id, updates) => {
    setAddresses((prev) => {
      const updated = prev.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const updated = prev.filter((addr) => addr.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => {
      const updated = prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getDefaultAddress = () => {
    return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
  };

  return (
    <AddressBookContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
      }}
    >
      {children}
    </AddressBookContext.Provider>
  );
};

export const useAddressBook = () => {
  const context = useContext(AddressBookContext);
  if (!context) {
    throw new Error('useAddressBook must be used within AddressBookProvider');
  }
  return context;
};
