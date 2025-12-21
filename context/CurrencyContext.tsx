import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Currency } from '../types';
import { INITIAL_CURRENCIES } from '../constants';

interface CurrencyContextType {
  currencies: Currency[];
  currentCurrency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (amount: number) => string;
  formatStringCurrency: (text: string) => string;
  // Admin functions
  addCurrency: (currency: Currency) => void;
  updateCurrency: (code: string, updates: Partial<Currency>) => void;
  deleteCurrency: (code: string) => void;
  toggleCurrencyActive: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES);
  const [currentCode, setCurrentCode] = useState<string>('USD');

  const currentCurrency = currencies.find(c => c.code === currentCode) || currencies[0];

  const setCurrency = (code: string) => {
    if (currencies.find(c => c.code === code)?.isActive) {
      setCurrentCode(code);
    }
  };

  const formatPrice = (amount: number): string => {
    // Base prices are assumed to be in USD. 
    // Convert USD -> Target Currency
    const convertedAmount = amount * currentCurrency.rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  };

  // Helper to find "$100" or "$100/hr" in a string and convert it
  const formatStringCurrency = (text: string): string => {
    if (currentCurrency.code === 'USD') return text;

    // Regex to match $ followed by numbers (including commas and decimals)
    // Matches: $2000, $2,000, $25.50
    return text.replace(/\$(\d+(?:,\d+)*(?:\.\d+)?)/g, (match, p1) => {
      const value = parseFloat(p1.replace(/,/g, ''));
      if (isNaN(value)) return match;
      return formatPrice(value);
    });
  };

  // --- Admin Actions ---

  const addCurrency = (newCurrency: Currency) => {
    if (currencies.some(c => c.code === newCurrency.code)) return;
    setCurrencies([...currencies, newCurrency]);
  };

  const updateCurrency = (code: string, updates: Partial<Currency>) => {
    setCurrencies(currencies.map(c => c.code === code ? { ...c, ...updates } : c));
  };

  const deleteCurrency = (code: string) => {
    if (code === 'USD') return; // Prevent deleting base currency
    setCurrencies(currencies.filter(c => c.code !== code));
    if (currentCode === code) setCurrentCode('USD');
  };

  const toggleCurrencyActive = (code: string) => {
    if (code === 'USD') return;
    setCurrencies(currencies.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
    if (currentCode === code) setCurrentCode('USD');
  };

  return (
    <CurrencyContext.Provider value={{
      currencies,
      currentCurrency,
      setCurrency,
      formatPrice,
      formatStringCurrency,
      addCurrency,
      updateCurrency,
      deleteCurrency,
      toggleCurrencyActive
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};