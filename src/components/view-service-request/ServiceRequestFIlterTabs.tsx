import { FC } from 'react';

interface FilterTabsProps {
  filter: "approved" | "rejected" | "pending";
  setFilter: (filter: "approved" | "rejected" | "pending") => void;
}

const FilterTabs: FC<FilterTabsProps> = ({ filter, setFilter }) => {
  const tabs = ['all', 'approved', 'rejected'];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setFilter(tab as "approved" | "rejected" | "pending")}
          className={`px-4 py-2 rounded-md ${
            filter === tab
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
