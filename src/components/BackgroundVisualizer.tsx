import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

const BackgroundVisualizer: React.FC = () => {
  const { isPlaying } = usePlayerStore();
  const [mounted, setMounted] = useState(false);
  const bars = Array.from({ length: 60 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 top-1/4 pointer-events-none overflow-hidden flex items-end justify-center gap-1 md:gap-[6px] px-2 opacity-30 blur-[1px] scale-110 z-0">
      {bars.map((_, i) => {
        // Calculate an organic arc shape (taller in the middle)
        const centerOffset = Math.abs(30 - i);
        const heightMultiplier = Math.max(0.1, 1 - (centerOffset / 30));
        
        const baseHeight = 10 + (20 * heightMultiplier);
        const maxVariance = 20 + (50 * heightMultiplier);

        return (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-600 via-purple-600/50 to-transparent rounded-t-full"
            initial={{ height: '5%' }}
            animate={{ 
              height: isPlaying 
                ? [
                    `${Math.random() * 10 + 5}%`, 
                    `${Math.random() * maxVariance + baseHeight}%`, 
                    `${Math.random() * 10 + 5}%`
                  ]
                : '5%' 
            }}
            transition={{
              duration: isPlaying ? Math.random() * 0.4 + 0.6 : 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: isPlaying ? Math.random() * -2 : 0
            }}
          />
        );
      })}
    </div>
  );
};

export default BackgroundVisualizer;
