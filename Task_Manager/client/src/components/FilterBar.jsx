import { Search, ArrowUpDown, X, Folder, Flag } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '@/types';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently added' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority rank' },
];

export function FilterBar({ filters, onChange, onReset, hasActiveFilters }) {
  return (
    <div className="card p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search tasks by title or description…"
            className="input pl-10 pr-9"
            aria-label="Search tasks"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X size={15} aria-hidden />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Segmented Pill */}
          <Segmented
            label="Status filter"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(v) => onChange({ status: v })}
          />

          {/* Category Filter */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Folder size={13} aria-hidden />
            </span>
            <select
              className="input py-2 pl-8 pr-8 text-xs font-medium cursor-pointer"
              value={filters.category}
              onChange={(e) => onChange({ category: e.target.value })}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Flag size={13} aria-hidden />
            </span>
            <select
              className="input py-2 pl-8 pr-8 text-xs font-medium cursor-pointer"
              value={filters.priority}
              onChange={(e) => onChange({ priority: e.target.value })}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown size={13} aria-hidden />
            </span>
            <select
              className="input py-2 pl-8 pr-8 text-xs font-medium cursor-pointer"
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              aria-label="Sort tasks"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost py-2 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              aria-label="Reset all filters"
            >
              <X size={14} aria-hidden /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div
      className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900/70"
      role="group"
      aria-label={label}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
              active
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
