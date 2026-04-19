import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiMusic, FiPlayCircle, FiHeadphones } from 'react-icons/fi';

const Welcome: React.FC = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    navigate('/app');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f1115] flex flex-col items-center justify-center font-sans">
      {/* Background gradients and blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center max-w-lg w-full px-6"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]"
        >
          <FiHeadphones className="text-white w-12 h-12" />
        </motion.div>

        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 text-center tracking-tight">
          VibeStream
        </h1>
        <p className="text-gray-400 text-lg text-center mb-10 leading-relaxed max-w-md">
          Your infinite personal radio. Paste YouTube links, build your ultimate queue, and let the music flow seamlessly.
        </p>

        {/* Feature Pills */}
        <div className="flex gap-3 mb-12 flex-wrap justify-center">
          {[
            { icon: FiPlayCircle, text: "Audio Only" },
            { icon: FiMusic, text: "Infinite Queue" }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md"
            >
              <feature.icon className="text-blue-400" />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Auth Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="w-full relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass-panel rounded-2xl p-8 flex flex-col gap-4">
            
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-xl transition-all duration-300 border border-white/10 font-medium active:scale-[0.98]"
            >
              <FcGoogle className="w-6 h-6" />
              <span>Continue with Google</span>
            </button>
            
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex gap-6 text-sm text-gray-500 font-medium"
        >
          <button onClick={() => navigate('/about')} className="hover:text-gray-300 transition-colors">About Us</button>
          <span>&bull;</span>
          <button onClick={() => navigate('/contact')} className="hover:text-gray-300 transition-colors">Contact Us</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
