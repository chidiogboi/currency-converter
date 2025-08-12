export default function CurrencySelector({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      >
        {options.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}
