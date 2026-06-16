import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  return (
    <div className="group bg-white dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-sm">
      {/* Avatar with spin-on-hover effect */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-linear-to-tr from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
        <img 
          src={user.avatar_url} 
          alt={user.login} 
          className="w-24 h-24 rounded-full border-2 border-slate-100 dark:border-slate-700 shadow-sm object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
        {user.name || user.login}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">@{user.login}</p>
      
      <div className="w-full mt-auto">
        <Link 
          to={`/user/${user.login}`} 
          className="block w-full text-center py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-500 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-inner"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}