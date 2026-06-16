import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getUserRepos } from '../services/githubApi';
import { supabase } from '../services/supabaseClient';

export default function UserProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchProfileAndFavoriteStatus() {
      setLoading(true);
      setError(null);
      try {
        const [userData, repoData] = await Promise.all([
          getUser(username),
          getUserRepos(username)
        ]);
        setUser(userData);
        setRepos(repoData);

        // Check if user is already bookmarked in Supabase
        const { data, error: sbError } = await supabase
          .from('favorites')
          .select('id')
          .eq('login', userData.login)
          .maybeSingle();

        if (!sbError && data) {
          setIsFavorite(true);
        }
      } catch (err) {
        setError(err.message || 'Could not fetch profile details.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfileAndFavoriteStatus();
  }, [username]);

  const toggleFavorite = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);

    try {
      if (isFavorite) {
        // Remove from database
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('login', user.login);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to database
        const { error } = await supabase
          .from('favorites')
          .insert([{
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            name: user.name,
            html_url: user.html_url
          }]);

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Database modification failed:', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-center">
        ⚠️ {error}
        <div className="mt-4">
          <Link to="/" className="text-sm underline hover:text-red-800">Back to Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-6">
        ← Back to Search
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
        <img 
          src={user.avatar_url} 
          alt={user.login} 
          className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-sm object-cover"
        />
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-3">
                {user.name || user.login}
                <button
                  onClick={toggleFavorite}
                  disabled={actionLoading}
                  className={`text-2xl outline-none focus:scale-110 active:scale-95 transition-transform disabled:opacity-50`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {isFavorite ? '❤️' : '🖤'}
                </button>
              </h1>
              <p className="text-gray-500">@{user.login}</p>
            </div>
            <a 
              href={user.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              Open GitHub Profile ↗
            </a>
          </div>

          {user.bio && <p className="mt-4 text-gray-600 text-sm leading-relaxed">{user.bio}</p>}

          <div className="grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto md:mx-0">
            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
              <span className="block text-xl font-bold text-gray-900">{user.public_repos}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Repos</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
              <span className="block text-xl font-bold text-gray-900">{user.followers}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Followers</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
              <span className="block text-xl font-bold text-gray-900">{user.following}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Following</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Recent Repositories</h2>
      
      {repos.length === 0 ? (
        <p className="text-gray-500 text-center py-6 bg-white border rounded-xl">No public repositories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {repos.slice(0, 6).map((repo) => (
            <div key={repo.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors">
              <div>
                <a 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline block truncate text-base mb-1"
                >
                  {repo.name}
                </a>
                <p className="text-xs text-gray-600 line-clamp-2 min-h-8">
                  {repo.description || "No description provided."}
                </p>
              </div>
              <div className="flex gap-4 mt-4 text-xs font-medium text-gray-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                    {repo.language}
                  </span>
                )}
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}