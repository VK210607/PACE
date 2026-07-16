// src/components/shared/SearchBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Debounced search bar used on the student dashboard.

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  isSearching = false,
  placeholder = 'Search events, exams, workshops...',
}: Props) {
  const [value, setValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);

    // Debounce: wait 400ms after typing stops before searching
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(q.trim());
    }, 400);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isSearching ? (
          <svg className="h-4 w-4 animate-spin text-maroon-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Search className="h-4 w-4 text-gray-400" />
        )}
      </div>

      <input
        id="event-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-9 pr-8"
        autoComplete="off"
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
