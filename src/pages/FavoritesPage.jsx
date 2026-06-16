import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import UserCard from '../components/UserCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFavorites() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Your Bookmarked Developers
        </h1>
        <p className="text-lg text-gray-500">
          Profiles stored and synced directly with your cloud database.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl max-w-xl mx-auto shadow-sm">
          <p className="text-3xl mb-2">💔</p>
          <p className="text-gray-600 font-medium">You haven't added any favorites yet!</p>
          <p className="text-sm text-gray-400 mt-1">Head back to search to add profiles here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}