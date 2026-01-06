interface FinancialRowProps {
  label: string;
  value: string;
  color?: string;
}

export function FinancialRow({ label, value, color = 'text-gray-900' }: FinancialRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
    </div>
  );
}

