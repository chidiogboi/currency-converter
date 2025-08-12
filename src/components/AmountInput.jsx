export default function AmountInput({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">Amount</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
}
