export default function ConversionResult({ amount, from, to, result }) {
  return (
    <div className="p-4 bg-green-100 border rounded-md text-center mt-4">
      <p className="text-lg font-semibold">
        {amount} {from} = {result} {to}
      </p>
    </div>
  );
}
