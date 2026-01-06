interface TemplateButtonProps {
  title: string;
  onClick: () => void;
}

export function TemplateButton({ title, onClick }: TemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 text-center transition-all hover:shadow-md"
    >
      <p className="text-sm font-semibold text-gray-800">{title}</p>
    </button>
  );
}

