interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full text-white`}>{icon}</div>
      </div>
    </div>
  );
}

