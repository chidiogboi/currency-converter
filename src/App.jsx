import { useState, useEffect } from "react";
import CurrencySelector from "./components/CurrencySelector";
import AmountInput from "./components/AmountInput";
import ConversionResult from "./components/ConversionResult";

export default function App() {
  const [currencies, setCurrencies] = useState(["USD", "EUR", "GBP", "NGN"]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    // Placeholder API call simulation
    const rate = 0.85; // pretend USD → EUR
    setResult((amount * rate).toFixed(2));
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Currency Converter</h1>

        <div className="space-y-4">
          <CurrencySelector
            label="From"
            value={fromCurrency}
            onChange={setFromCurrency}
            options={currencies}
          />

          <CurrencySelector
            label="To"
            value={toCurrency}
            onChange={setToCurrency}
            options={currencies}
          />

          <AmountInput value={amount} onChange={setAmount} />
        </div>

        <ConversionResult
          amount={amount}
          from={fromCurrency}
          to={toCurrency}
          result={result}
        />
      </div>
    </div>
  );
}
