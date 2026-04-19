import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiSend } from 'react-icons/fi';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:dipent700@gmail.com?subject=${encodeURIComponent(subject || 'VibeStream Feedback')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen relative overflow-y-auto bg-[#0f1115] text-white font-sans flex flex-col items-center justify-center p-6 custom-scrollbar">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* subtle glow inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="mb-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white">
               <FiMail size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-2">Get in Touch</h2>
            <p className="text-gray-400 text-sm">Have feedback, discovered a bug, or just want to say hi? I'd love to hear from you at <span className="text-blue-400">dipent700@gmail.com</span></p>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-5 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</label>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium h-32 resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <FiSend /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
