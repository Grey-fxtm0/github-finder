import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  // Debounce Logic: Wait 600ms after the user stops typing before firing the search
  useEffect(() => {
    // Don't search if the input field is completely empty
    if (!query.trim()) return;

    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 600);

    // Cleanup function: clears the timer if the user types another key within 600ms
    return () => clearTimeout(timer);
  }, [query]); // ⚠️ CRITICAL FIX: Remove 'onSearch' from the dependency array to kill the infinite loop!

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a GitHub username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 transition-all text-base"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all shadow-sm"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}