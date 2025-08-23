import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ServiceFilters } from '@/hooks/useServices';
import { SlidersIcon, TimesIcon } from './Icons';

interface FilterSectionProps {
  filters: ServiceFilters;
  setFilters: (filters: ServiceFilters) => void;
  onResetFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters, onResetFilters }) => {
  const [showFilters, setShowFilters] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);

  const categories = [
    "Photography", "Venues", "Sound", "Caterers", "Decoration",
    "Bridal Wear", "Jewellery", "Favors", "Planners", "Bridal Makeup",
    "Videographers", "Groom Wear", "Mehendi Artists", "Cakes", "Cards",
    "Choreographers", "Beauty", "Entertainment"
  ];

  const locations = ["Vadodara", "Rajkot", "Bangalore", "Hyderabad", "Chennai"];
  const ratings = ["5", "4", "3", "2", "1"];
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" }
  ];

  // Debounce filter updates
  const debouncedSetFilters = useDebouncedCallback((newFilters: ServiceFilters) => {
    setFilters(newFilters);
  }, 300);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    debouncedSetFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <div className="filter-section bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <button
          id="filterToggle"
          className="filter-toggle flex items-center text-secondary font-medium hover:text-opacity-80"
          onClick={toggleFilters}
          aria-expanded={showFilters}
        >
          {showFilters ? <TimesIcon className="mr-2" /> : <SlidersIcon className="mr-2" />}
          <span>Advanced Filters</span>
        </button>
      </div>

      <form
        id="filterForm"
        className={`filter-content ${showFilters ? 'block' : 'hidden'} mt-4 transition-all duration-300`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={localFilters.category}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              name="location"
              value={localFilters.location}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={handleFilterChange}
                className="w-1/2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={handleFilterChange}
                className="w-1/2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              name="rating"
              value={localFilters.rating}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
            >
              <option value="">Any Rating</option>
              {ratings.map((r) => (
                <option key={r} value={r}>
                  {r} {r === '5' ? 'Stars' : '+ Stars'}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-4 flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                name="sortBy"
                value={localFilters.sortBy}
                onChange={handleFilterChange}
                className="rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 p-2"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onResetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterSection;