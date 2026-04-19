import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { usePlayerStore } from '../store/usePlayerStore';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const addToQueue = usePlayerStore(state => state.addToQueue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchResults([]);

    try {
      const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^"&?\/\s]{11})/;
      const match = query.match(urlRegex);

      if (match && match[1]) {
        const videoId = match[1];
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        if (!apiKey) {
           alert("No YouTube API Key found.");
           setIsLoading(false);
           return;
        }

        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
        if (!res.ok) throw new Error("YouTube API Error");
        
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          addToQueue({
            videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          });
        } else {
          addToQueue({
            videoId,
            title: `YouTube Video (${videoId})`,
            channelTitle: 'Added from link',
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          });
        }
        setQuery('');
      } else {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        if (!apiKey) {
           alert("No YouTube API Key found.");
           setIsLoading(false);
           return;
        }

        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`);
        if (!res.ok) throw new Error("YouTube API Error");
        
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setSearchResults(data.items);
        } else {
          alert('No results found!');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTrack = (item: any) => {
    addToQueue({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
    });
    setSearchResults([]);
    setQuery('');
  };

  return (
    <div className="mb-6 relative w-full z-50">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative flex items-center bg-[#1a1d24] border border-white/10 rounded-xl overflow-hidden shadow-lg pl-3 focus-within:border-blue-500/50 transition-colors">
          <FiSearch className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search or paste YouTube link..." 
            className="flex-1 bg-transparent border-none outline-none text-sm text-white px-3 py-3 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="px-2 flex items-center gap-2">
            {query && (
              <button type="button" onClick={() => { setQuery(''); setSearchResults([]); }} className="text-gray-400 hover:text-white p-1">
                <FiX />
              </button>
            )}
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-blue-600/20 hover:bg-blue-500/40 text-blue-400 p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /> : <FiSearch />}
            </button>
          </div>
        </div>
      </form>

      {/* Internal Dropdown for Search Results */}
      {searchResults.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
          {searchResults.map((item) => (
            <div key={item.id.videoId} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleAddTrack(item)}>
              <img src={item.snippet.thumbnails?.default?.url} className="w-12 h-12 object-cover rounded bg-black" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate" dangerouslySetInnerHTML={{ __html: item.snippet.title }}></p>
                <p className="text-xs text-gray-500 truncate" dangerouslySetInnerHTML={{ __html: item.snippet.channelTitle }}></p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddTrack(item); }}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                title="Add to Queue"
              >
                <FiPlus />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
