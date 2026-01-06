interface AppointmentCardProps {
  time: string;
  patientName: string;
  reason: string;
  status: 'waiting' | 'completed' | 'upcoming';
  showActions?: boolean;
  onActionClick?: () => void;
}

export function AppointmentCard({ 
  time, 
  patientName, 
  reason, 
  status, 
  showActions = false,
  onActionClick 
}: AppointmentCardProps) {
  const statusColors = {
    waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    upcoming: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const statusLabels = {
    waiting: 'في الانتظار',
    completed: 'مكتمل',
    upcoming: 'قادم',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-gray-700">{time}</div>
          <div>
            <p className="font-semibold text-gray-900">{patientName}</p>
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
          {showActions && status === 'waiting' && (
            <button 
              onClick={onActionClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              إدخال للدكتور
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

