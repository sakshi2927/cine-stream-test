import React from 'react';

export default function SearchBar({
  value,
  onChange,
  onSearch = onChange,
  placeholder = 'Search movies...'
}) {
  const handleSearch = () => {
    onSearch(value);
  };

  return (
    <div className="search-group">
      <input
        className="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        placeholder={placeholder}
      />
      <button type="button" className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
