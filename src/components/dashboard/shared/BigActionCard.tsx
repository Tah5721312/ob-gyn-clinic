interface BigActionCardProps {
  title: string;
  description?: string;
  icon: string;
  onClick: () => void;
  color?: string;
}

export function BigActionCard({ 
  title, 
  description, 
  icon, 
  onClick,
  color = "bg-blue-600"
}: BigActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} hover:opacity-90 rounded-xl p-8 text-white transition-all duration-200 hover:shadow-xl transform hover:scale-105`}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-white/80 text-sm">{description}</p>
        )}
      </div>
    </button>
  );
}

