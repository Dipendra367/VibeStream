import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Player from '../components/Player';
import Queue from '../components/Queue';
import SearchBar from '../components/SearchBar';
import BackgroundVisualizer from '../components/BackgroundVisualizer';

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen bg-[#0f1115] text-white flex flex-col font-sans overflow-hidden">
      <BackgroundVisualizer />
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md z-10 shrink-0">
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 select-none">
          VibeStream
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 hidden md:flex">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors uppercase tracking-wider">About</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors uppercase tracking-wider">Contact</button>
          </div>
          <div className="w-px h-4 bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <img src={user?.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
            <span className="text-sm font-medium text-gray-200 hidden sm:block">{user?.displayName}</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-xs font-semibold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10 text-gray-300 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout (Player left, Queue right) */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative custom-scrollbar">
        {/* LEFT COMPONENT - PLAYER */}
        <div className="w-full md:w-[65%] lg:w-[70%] border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center relative md:overflow-hidden bg-gradient-to-b from-transparent to-black/30 py-8 md:py-0 shrink-0">
           {/* Subtle background glow behind player */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />
           <Player />
        </div>

        {/* RIGHT COMPONENT - QUEUE */}
        <div className="w-full h-[600px] md:h-full md:w-[35%] lg:w-[30%] bg-[#12141a] flex flex-col z-10 overflow-hidden shadow-2xl relative shrink-0">
          <div className="p-4 border-b border-white/5 shrink-0 bg-[#15181e] z-10 shadow-lg">
             <SearchBar />
             <div className="flex justify-between items-center mb-1 px-1">
               <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Up Next</h3>
             </div>
          </div>
          <Queue />
        </div>
      </div>
    </div>
  );
};

export default MainApp;
