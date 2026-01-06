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
      className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-6 text-right transition-all duration-200 hover:shadow-lg border border-blue-200"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

