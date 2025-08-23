import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

export const BookingFilters = ({
  filters,
  onFilterChange,
  onReset
}: {
  filters: {
    status: string;
    search: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Completed', label: 'Completed' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-500">
              <FaSearch className="text-lg" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none focus:ring-pink-300 focus:border-pink-500 bg-gray-50 transition-all"
               //className="w-full rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
              
              placeholder="Search bookings..."
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-pink-600 transition"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48 relative">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="appearance-none  block w-full pl-3 pr-8 py-2.5 border border-gray-200 focus:outline-none rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 bg-gray-50 cursor-pointer transition-all"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
              <FiChevronDown className="text-lg" />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-72">
          <div className="relative">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              max={filters.dateTo || undefined}
              className="block w-full pl-3 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 bg-gray-50 transition-all"
            />
            {filters.dateFrom && (
              <span className="absolute -top-2 left-2 px-1 text-xs bg-white text-pink-600">From</span>
            )}
          </div>
          <div className="relative">
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              min={filters.dateFrom || undefined}
              className="block w-full pl-3 pr-3 focus:outline-none py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 bg-gray-50 transition-all"
            />
            {filters.dateTo && (
              <span className="absolute -top-2 left-2 px-1 text-xs bg-white text-pink-600">To</span>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2.5 border border-pink-200 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <FaFilter className="text-pink-500" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};