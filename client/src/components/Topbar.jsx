import { Search, Filter, Calendar } from 'lucide-react';

export default function Topbar({ query, setQuery, range, setRange }) {
  return (
    <div className="flex items-center justify-end gap-4 p-4  rounded-2xl shadow-sm border border-white/20">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-80 bg-gray-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 placeholder-gray-400"
          placeholder="Search employees, duties, or inventory..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <select 
          className="px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 text-gray-700 text-sm font-medium"
          value={range} 
          onChange={e => setRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">This Year</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Filter Button */}
      <button className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-2">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters</span>
      </button>
    </div>
  );
}
