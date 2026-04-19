import React, { useRef, useState, useEffect } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiShuffle, FiRepeat } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { type YouTubeProps } from 'react-youtube';
import { usePlayerStore } from '../store/usePlayerStore';
import MusicWave from './MusicWave';

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const YOUTUBE_OPTS: YouTubeProps['opts'] = {
  height: '0',
  width: '0',
  playerVars: { autoplay: 0, controls: 0, disablekb: 1 },
};

const Player: React.FC = () => {
  const { 
    queue, currentIndex, isPlaying, setIsPlaying, 
    playNext, playPrevious, isShuffle, toggleShuffle,
    isLoop, toggleLoop 
  } = usePlayerStore();

  const currentSong = queue[currentIndex];
  
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [lastVideoId, setLastVideoId] = useState(currentSong?.videoId);

  // Synchronously reset player lock if video changes to avoid calling methods on an unmounting iframe
  if (currentSong?.videoId !== lastVideoId) {
    setIsPlayerReady(false);
    playerRef.current = null;
    setLastVideoId(currentSong?.videoId);
  }

  // Sync YouTube play state
  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (err) {
        console.warn("YouTube API call aborted: player might be unmounting", err);
      }
    }
  }, [isPlaying, isPlayerReady, currentSong?.videoId]);

  // Sync Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && playerRef.current && isPlayerReady) {
      interval = setInterval(async () => {
        try {
          if (playerRef.current?.getCurrentTime && !isScrubbing) {
            const time = await playerRef.current.getCurrentTime();
            const len = await playerRef.current.getDuration();
            if (time !== undefined) setCurrentTime(time);
            if (len !== undefined) setDuration(len);
          }
        } catch (e) {}
      }, 100); // Super fast interval for smooth tracking
    }
    return () => clearInterval(interval);
  }, [isPlaying, isScrubbing, isPlayerReady]);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === 0) { // ENDED
      if (isLoop === 'track' && playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
        setCurrentTime(0);
      } else {
        playNext();
      }
    } else if (event.data === 1) { // PLAYING
      setIsPlaying(true);
    } else if (event.data === 2) { // PAUSED
      setIsPlaying(false);
    } else if (event.data === 5 || event.data === -1) { // CUED or UNSTARTED
      if (isPlaying && playerRef.current && isPlayerReady) {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsScrubbing(true);
    setCurrentTime(Number(e.target.value));
  };

  const handleSeekCommit = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const newTime = Number(e.currentTarget.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
    // Allow YouTube a moment to buffer the jump before interval resumes
    setTimeout(() => {
      setIsScrubbing(false);
    }, 200);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col items-center justify-center p-8">
      {/* Hidden YouTube Player */}
      {currentSong && (
        <div className="hidden">
          <YouTube
            videoId={currentSong.videoId}
            opts={YOUTUBE_OPTS}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </div>
      )}

      {/* Album Art / Thumbnail Container */}
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 mb-8 border border-white/5">
        <AnimatePresence mode="wait">
          {currentSong ? (
            <motion.img
              key={currentSong.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-all duration-[3s] ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center"
            >
              <FiPlay className="w-16 h-16 text-white/20" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Song Info */}
      <div className="text-center mb-6 h-16">
        <h2 className="text-2xl font-bold text-white line-clamp-1 max-w-xl">
          {currentSong ? currentSong.title : 'No track playing'}
        </h2>
        <p className="text-gray-400 mt-1">
          {currentSong ? currentSong.channelTitle || 'YouTube Audio' : 'Add songs to the queue'}
        </p>
      </div>

      {/* Premium Custom Web Player Seek Bar */}
      <div className="w-full max-w-xl flex items-center gap-5 mb-8">
        <span className="text-sm font-semibold text-gray-300 w-12 text-right tabular-nums tracking-wide">{formatTime(currentTime)}</span>
        
        <div className="relative flex-1 py-4 group flex items-center cursor-pointer">
          {/* Background track (Dark track with inset shadow) */}
          <div className="absolute w-full h-2 bg-[#0f1115] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-white/5">
            {/* Active Progress Gradient */}
            <div 
              className={`h-full relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 ${!isScrubbing ? 'transition-[width] ease-linear duration-100' : ''}`} 
              style={{ width: `${progressPercentage}%` }} 
            >
               {/* Inner glossy highlight for active progress */}
               <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 mix-blend-overlay"></div>
            </div>
          </div>

          {/* Draggable Thumb (Always visible, massive glowing neon effect, scales on hover) */}
          <div 
            className={`absolute h-4 w-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9),_0_0_25px_rgba(168,85,247,0.8)] transform scale-100 group-hover:scale-150 pointer-events-none -translate-x-1/2 z-20 ${!isScrubbing ? 'transition-all duration-100' : 'transition-[transform] duration-200'}`} 
            style={{ left: `${progressPercentage}%` }} 
          >
            <div className="absolute inset-0 bg-white rounded-full blur-[2px] opacity-50"></div>
          </div>
          
          {/* Transparent hit area for grabbing and scrubbing */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeekChange}
            onMouseDown={() => setIsScrubbing(true)}
            onTouchStart={() => setIsScrubbing(true)}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            disabled={!currentSong}
            className="absolute inset-x-0 inset-y-1/2 -translate-y-1/2 w-full h-8 opacity-0 cursor-pointer disabled:cursor-not-allowed z-30"
          />
        </div>

        <span className="text-sm font-medium text-gray-500 w-12 tabular-nums tracking-wide">{formatTime(duration)}</span>
      </div>

      {/* Music Wave */}
      <div className="mb-6 h-8">
        <MusicWave isPlaying={isPlaying && !!currentSong} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-2">
        <button 
          onClick={toggleShuffle} 
          className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 ${isShuffle ? 'text-blue-400 bg-blue-400/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:text-white'}`}
        >
          <FiShuffle className="w-5 h-5" />
        </button>

        <button 
          onClick={playPrevious}
          className="p-3 text-gray-300 hover:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          disabled={!currentSong}
        >
          <FiSkipBack className="w-6 h-6 fill-current" />
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={!currentSong}
          className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white shadow-xl shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/50 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
        >
          {isPlaying ? <FiPause className="w-8 h-8 fill-current" /> : <FiPlay className="w-8 h-8 translate-x-0.5 fill-current" />}
        </button>

        <button 
          onClick={playNext}
          className="p-3 text-gray-300 hover:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          disabled={!currentSong}
        >
          <FiSkipForward className="w-6 h-6 fill-current" />
        </button>

        <button 
          onClick={toggleLoop} 
          className={`p-3 rounded-full transition-all hover:scale-110 active:scale-95 relative ${isLoop !== 'none' ? 'text-blue-400 bg-blue-400/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:text-white'}`}
        >
          <FiRepeat className="w-5 h-5" />
          {isLoop === 'track' && (
             <span className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-blue-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-lg">1</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Player;
