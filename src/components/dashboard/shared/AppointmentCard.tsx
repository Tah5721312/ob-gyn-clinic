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
    <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent group-hover:via-blue-400 transition-colors" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors border border-gray-100">
            <span className="text-sm font-bold text-gray-400 group-hover:text-blue-400">الساعة</span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 font-mono tracking-tight">{time}</span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-1">{patientName}</h4>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
          {showActions && status === 'waiting' && (
            <button
              onClick={onActionClick}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm shadow-blue-200 transition-colors"
            >
              دخول للكشف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

