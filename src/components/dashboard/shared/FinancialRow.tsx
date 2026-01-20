interface FinancialRowProps {
  label: string;
  value: string;
  color?: string;
}

export function FinancialRow({ label, value, color = 'text-gray-900' }: FinancialRowProps) {
  return (
    <div className="flex justify-between items-center py-3 px-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
      <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{label}</span>
      <span className={`font-bold text-lg tracking-tight ${color}`}>{value}</span>
    </div>
  );
}

