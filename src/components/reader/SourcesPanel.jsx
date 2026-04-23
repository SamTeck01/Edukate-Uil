import { useState } from 'react';
import { Plus, Search, Check, Copy, Globe, Zap, ArrowRight } from 'lucide-react';
import './sourcespanel.css';

/**
 * Sources panel — left sidebar matching NotebookLM:
 * - "Sources" header + panel icon
 * - "+ Add sources" button
 * - "Search the web for new sources" input
 * - "Web" + "Fast Research" pills
 * - "Select all sources" checkbox
 * - List of source materials with checkmarks
 */
export default function SourcesPanel({ materials, activeMaterialId, onSelectMaterial, course }) {
  const [selectedIds, setSelectedIds] = useState(
    new Set(materials.map(m => m.id))
  );
  const [allSelected, setAllSelected] = useState(true);

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(materials.map(m => m.id)));
    }
    setAllSelected(!allSelected);
  };

  const toggleSource = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
    setAllSelected(next.size === materials.length);
  };

  return (
    <div className="sources-panel">
      {/* Header: "Sources" + icon */}
      <div className="sources-header">
        <h2 className="sources-title">Sources</h2>
        <button className="sources-header-icon" aria-label="Panel options">
          <Copy size={16} />
        </button>
      </div>

      {/* Add sources button */}
      <button className="sources-add-btn">
        <Plus size={16} />
        <span>Add sources</span>
      </button>

      {/* Search web */}
      <div className="sources-search">
        <Search size={14} className="sources-search-icon" />
        <span className="sources-search-text">Search the web for new sources</span>
      </div>

      {/* Web + Fast Research pills */}
      <div className="sources-pills">
        <button className="sources-pill">
          <Globe size={13} />
          <span>Web</span>
        </button>
        <button className="sources-pill sources-pill--highlight">
          <Zap size={13} />
          <span>Fast Research</span>
        </button>
        <button className="sources-pill-arrow">
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Divider */}
      <div className="sources-divider" />

      {/* Select all */}
      <button className="sources-select-all" onClick={toggleAll}>
        <span className="sources-select-text">Select all sources</span>
        <div className={`sources-checkbox ${allSelected ? 'sources-checkbox--checked' : ''}`}>
          {allSelected && <Check size={12} />}
        </div>
      </button>

      {/* Source list */}
      <div className="sources-list">
        {materials.map(mat => (
          <button
            key={mat.id}
            className={`sources-item ${mat.id === activeMaterialId ? 'sources-item--active' : ''}`}
            onClick={() => onSelectMaterial(mat.id)}
          >
            <span className="sources-item-icon">📄</span>
            <span className="sources-item-title">{mat.title}</span>
            <div
              className={`sources-checkbox ${selectedIds.has(mat.id) ? 'sources-checkbox--checked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSource(mat.id);
              }}
            >
              {selectedIds.has(mat.id) && <Check size={12} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
