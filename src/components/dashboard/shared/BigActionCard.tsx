interface BigActionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
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
      className={`relative group overflow-hidden ${color} rounded-2xl p-6 text-white transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 border border-white/10`}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125" />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-black/10 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        {/* Icon Container with Glass Effect */}
        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
          <div className="text-white drop-shadow-md">
            {icon}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-sm">
            {title}
          </h3>
          {description && (
            <p className="text-white/90 text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Surface Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
}

