import { useState } from 'react';
import { searchUsers } from '../services/githubApi';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchUsers(query);
      setUsers(data.users);
      if (data.users.length === 0) {
        setError('No users found matching that criteria.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong while searching.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 sm:text-4xl">
          Find GitHub Developers
        </h1>
        <p className="text-lg text-gray-500">
          Search profiles, explore public repositories, and track your favorites.
        </p>
      </div>

      {/* Interactive Search Bar Control */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Loading State Spinner Display */}
      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error / Empty Messaging Box */}
      {error && !isLoading && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl max-w-2xl mx-auto text-center font-medium border border-red-100 shadow-sm my-6">
          ⚠️ {error}
        </div>
      )}

      {/* Grid Layout Container for Dynamic Cards */}
      {!isLoading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}