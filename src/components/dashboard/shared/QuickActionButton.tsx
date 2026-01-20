interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export function QuickActionButton({ title, description, icon, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 text-right"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="p-3 bg-blue-50 text-2xl rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">{description}</p>
        </div>
      </div>
    </button>
  );
}

