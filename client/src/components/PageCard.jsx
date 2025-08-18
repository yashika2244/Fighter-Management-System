export default function PageCard({title, onClick}){
  return (
    <button onClick={onClick}
      className="w-72 h-22 bg-gray-100 rounded hover:bg-gray-50 cursor-pointer transition flex items-center justify-center text-lg font-medium">
      {title}
    </button>
  );
}
