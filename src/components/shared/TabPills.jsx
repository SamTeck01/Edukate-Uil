import './tabpills.css';

export default function TabPills({ tabs, activeTab, onChange }) {
  return (
    <div className="tab-pills" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-pill ${activeTab === tab.id ? 'tab-pill--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
