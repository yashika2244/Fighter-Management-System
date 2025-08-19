export default function PageCard({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-72 h-22 bg-gray-100 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all transform hover:-translate-y-1 flex items-center justify-center text-lg font-medium text-gray-800 cursor-pointer"
    >
      {title}
    </button>
  );
}
