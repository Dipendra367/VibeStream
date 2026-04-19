import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCode, FiMusic, FiZap } from 'react-icons/fi';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative bg-[#0f1115] text-white font-sans overflow-x-hidden pb-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16 text-center">
             <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 tracking-tight">
               About VibeStream
             </h1>
             <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
               Redefining how you experience YouTube audio. Build your queue, hit play, and let the music flow without distractions.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: "The Problem", icon: FiZap, desc: "YouTube is built for video, demanding your screen and battery. Traditional music apps lock the best features behind paywalls." },
              { title: "Our Solution", icon: FiMusic, desc: "VibeStream extracts the audio essence of YouTube. Just paste a link and enjoy your custom radio effortlessly in the background." },
              { title: "The Design", icon: FiCode, desc: "Crafted with a sleek, distraction-free interface that puts your playlist front and center, complete with a persistent cloud queue." }
            ].map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <section.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-200">{section.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{section.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full relative group max-w-2xl mx-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-[#1a1d24] rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center shadow-2xl">
               <img src="https://ui-avatars.com/api/?name=Dipendra+Thapa&background=random&size=150" alt="Dipendra Thapa" className="w-24 h-24 rounded-full border-4 border-[#0f1115] shadow-lg mb-4" />
               <h3 className="text-2xl font-bold text-white mb-2">Made by Dipendra Thapa</h3>
               <p className="text-gray-400 text-sm max-w-md">
                 A passionate developer dedicated to building beautiful, performant, and user-centric web experiences. VibeStream was created to bridge the gap between open music availability and premium app experiences.
               </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
