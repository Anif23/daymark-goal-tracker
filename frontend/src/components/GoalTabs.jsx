const GoalTabs = ({ tabs, activeTab, counts, onChange }) => (
  <div
    className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2"
    role="tablist"
    aria-label="Filter goals"
  >
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.key}
        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeTab === tab.key ? "bg-[#123c35] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}{" "}
        <span
          className={
            activeTab === tab.key ? "text-[#e8c547]" : "text-slate-400"
          }
        >
          {counts[tab.key] ?? 0}
        </span>
      </button>
    ))}
  </div>
);

export default GoalTabs;
