export default function Topbar({query,setQuery,range,setRange}){
  return (
    <div className="flex items-center justify-end gap-3 p-3">
      <input
        className="border  border-gray-400 rounded px-3  w-72"
        placeholder=""
        value={query}
        onChange={e=>setQuery(e.target.value)}
      />
      <select className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-sm" value={range} onChange={e=>setRange(e.target.value)}>
        <option>Last 7 days</option>
        <option>Last 90 days</option>
        <option>This Year</option>
        <option>All time</option>
      </select>
    </div>
  );
}
