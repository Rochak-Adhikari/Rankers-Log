import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [userResults, setUserResults] = useState([])
  const [postResults, setPostResults] = useState([])
  const [guildResults, setGuildResults] = useState([])

  const filters = ['all', 'users', 'posts', 'guilds']
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      performSearch()
    } else {
      setUserResults([])
      setPostResults([])
      setGuildResults([])
    }
  }, [debouncedQuery, activeFilter])

  async function performSearch() {
    setLoading(true)
    const searchTerm = debouncedQuery.trim()
    
    try {
      const promises = []

      // Search users
      if (activeFilter === 'all' || activeFilter === 'users') {
        promises.push(
          supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, level, rank')
            .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
            .limit(10)
            .then(({ data }) => ({ type: 'users', data: data || [] }))
        )
      }

      // Search posts
      if (activeFilter === 'all' || activeFilter === 'posts') {
        promises.push(
          supabase
            .from('posts')
            .select('id, content, media_title, media_type, created_at, profiles:user_id(username, avatar_url)')
            .or(`content.ilike.%${searchTerm}%,media_title.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false })
            .limit(10)
            .then(({ data }) => ({ type: 'posts', data: data || [] }))
        )
      }

      // Search guilds
      if (activeFilter === 'all' || activeFilter === 'guilds') {
        promises.push(
          supabase
            .from('guilds')
            .select('id, name, description, member_count, banner_url')
            .ilike('name', `%${searchTerm}%`)
            .eq('is_public', true)
            .limit(10)
            .then(({ data }) => ({ type: 'guilds', data: data || [] }))
        )
      }

      // Execute all searches in parallel
      const results = await Promise.all(promises)
      
      results.forEach(({ type, data }) => {
        if (type === 'users') setUserResults(data)
        if (type === 'posts') setPostResults(data)
        if (type === 'guilds') setGuildResults(data)
      })
    } catch (error) {
      console.error('Search error:', error)
    }
    
    setLoading(false)
  }

  return (
    <>
      {/* Search Header */}
      <div className="w-full mb-6">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-2xl">search</span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-14 pr-4 py-4 bg-[#15222e]/80 border border-white/10 rounded-lg text-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="Search anime, manga, games, users..."
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
        </div>
      ) : debouncedQuery.trim().length < 2 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">search</span>
          <p className="text-gray-500">Type at least 2 characters to search</p>
          <p className="text-gray-600 text-sm mt-2">Search for users, posts, and guilds</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Results */}
          {userResults.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Users ({userResults.length})
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {userResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/u/${user.username}`)}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border border-white/10 bg-gray-800 flex items-center justify-center" style={user.avatar_url ? { backgroundImage: `url('${user.avatar_url}')` } : {}}>
                      {!user.avatar_url && <span className="material-symbols-outlined text-gray-500">person</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{user.display_name || user.username}</h3>
                      <p className="text-xs text-gray-500">@{user.username} • Level {user.level} • {user.rank}-Rank</p>
                    </div>
                    <button className="bg-primary/10 border border-primary/30 px-3 py-2 rounded text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Results */}
          {postResults.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Posts ({postResults.length})
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {postResults.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}/comments`)}
                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-cover bg-center bg-gray-800 flex items-center justify-center" style={post.profiles?.avatar_url ? { backgroundImage: `url('${post.profiles.avatar_url}')` } : {}}>
                        {!post.profiles?.avatar_url && <span className="material-symbols-outlined text-gray-500 text-xs">person</span>}
                      </div>
                      <span className="text-xs text-gray-400">@{post.profiles?.username}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">{post.media_type}</span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-1">{post.media_title || 'Post'}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guild Results */}
          {guildResults.length > 0 && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Guilds ({guildResults.length})
                </h2>
              </div>
              <div className="divide-y divide-white/5">
                {guildResults.map((guild) => (
                  <div
                    key={guild.id}
                    onClick={() => navigate(`/guilds/${guild.id}`)}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: guild.banner_url ? `url('${guild.banner_url}')` : 'none', backgroundColor: '#1a1a1a' }}>
                      {!guild.banner_url && <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-gray-600">groups</span></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">{guild.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{guild.description || 'No description'}</p>
                      <p className="text-xs text-gray-600 mt-1">{guild.member_count || 0} members</p>
                    </div>
                    <button className="bg-primary/10 border border-primary/30 px-3 py-2 rounded text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all">
                      View Guild
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {userResults.length === 0 && postResults.length === 0 && guildResults.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">search_off</span>
              <p className="text-gray-500">No results found for "{debouncedQuery}"</p>
              <p className="text-gray-600 text-sm mt-2">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
