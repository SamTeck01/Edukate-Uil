import { useState } from 'react';
import { Search, LayoutGrid, AlignJustify, ChevronDown, Plus, Check } from 'lucide-react';
import TabPills from '../shared/TabPills';
import Button from '../shared/Button';
import './filterbar.css';

const sortOptions = [
  { id: 'recent', label: 'Most recent' },
  { id: 'alpha', label: 'A → Z' },
  { id: 'progress', label: 'By progress' },
];

export default function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  sortBy = 'recent',
  onSortChange,
  onCreateNew,
}) {
  const [showSort, setShowSort] = useState(false);

  const currentSort = sortOptions.find(s => s.id === sortBy) || sortOptions[0];

  return (
    <div className="filter-bar">
      <div className="filter-bar-left">
        <TabPills tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      </div>

      <div className="filter-bar-right">
        {/* Search — just a circle icon like NotebookLM */}
        <button className="filter-circle-btn" aria-label="Search">
          <Search size={18} />
        </button>

        {/* View toggle — checkmark + grid icon (active) | list icon */}
        <div className="filter-view-toggle">
          <button
            className={`filter-view-btn ${viewMode === 'grid' ? 'filter-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            {viewMode === 'grid' && <Check size={14} className="filter-view-check" />}
            <LayoutGrid size={18} />
          </button>
          <button
            className={`filter-view-btn ${viewMode === 'list' ? 'filter-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            {viewMode === 'list' && <Check size={14} className="filter-view-check" />}
            <AlignJustify size={18} />
          </button>
        </div>

        {/* Sort dropdown — pill "Most recent ▼" */}
        <div className="filter-sort-wrap">
          <button
            className="filter-sort-btn"
            onClick={() => setShowSort(!showSort)}
          >
            <span>{currentSort.label}</span>
            <ChevronDown size={14} className={`filter-sort-chevron ${showSort ? 'filter-sort-chevron--open' : ''}`} />
          </button>
          {showSort && (
            <>
              <div className="filter-sort-backdrop" onClick={() => setShowSort(false)} />
              <div className="filter-sort-dropdown">
                {sortOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`filter-sort-option ${sortBy === opt.id ? 'filter-sort-option--active' : ''}`}
                    onClick={() => {
                      onSortChange(opt.id);
                      setShowSort(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Create new — dark pill button like NotebookLM "+ Create new" */}
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreateNew}
        >
          Create new
        </Button>
      </div>
    </div>
  );
}
