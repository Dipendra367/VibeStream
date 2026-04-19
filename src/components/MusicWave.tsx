import React from 'react';
import { motion } from 'framer-motion';

interface MusicWaveProps {
  isPlaying: boolean;
}

const MusicWave: React.FC<MusicWaveProps> = ({ isPlaying }) => {
  const bars = Array.from({ length: 6 });

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-blue-500 to-purple-400 rounded-full"
          initial={{ height: 4 }}
          animate={{
            height: isPlaying ? [4, 16 + Math.random() * 12, 4 + Math.random() * 8, 4] : 4,
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: Math.random() * 0.2, // staggered
          }}
        />
      ))}
    </div>
  );
};

export default MusicWave;
