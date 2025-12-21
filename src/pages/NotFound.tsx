import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background decoration - inherits from body but adds localized glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-72 h-72 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="glass-card p-8 md:p-12 rounded-3xl text-center relative z-10 max-w-2xl w-full animate-fade-in">
        <h1 className="text-8xl md:text-9xl font-bold mb-2 font-display text-gradient animate-float drop-shadow-sm">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-slate-800 tracking-tight">
          Page Not Found
        </h2>

        <p className="text-base md:text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
          Oops! The page you're looking for seems to have vanished into the void.
          It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 bg-white/50 text-slate-700 font-medium hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-95 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <FaHome />
            Return Home
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest z-10 opacity-60">
        Error Code: 404
      </div>
    </div>
  );
};

export default NotFound;
