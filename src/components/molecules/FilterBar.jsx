import React from 'react';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  filters = [],
  onFilterChange,
  onClearFilters,
  hasActiveFilters = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
        <ApperIcon name="Filter" size={16} />
        <span>Filters:</span>
      </div>
      
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className="min-w-[150px]"
          placeholder={filter.placeholder}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ))}
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearFilters}
        >
          <ApperIcon name="X" size={14} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;