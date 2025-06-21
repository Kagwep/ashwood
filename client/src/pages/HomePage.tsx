import React, { useState } from 'react';

const TacticalCommandHomepage = ({ onStartGame }) => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50 overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`
             }} />
      </div>

      {/* Floating Combat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl text-amber-600/20 animate-bounce">⚔️</div>
        <div className="absolute top-40 right-32 text-4xl text-amber-500/30 animate-pulse">🛡️</div>
        <div className="absolute bottom-32 left-40 text-5xl text-amber-700/25 animate-ping">🏰</div>
        <div className="absolute bottom-20 right-20 text-3xl text-amber-600/20 animate-bounce">🐎</div>
        <div className="absolute top-60 left-1/3 text-4xl text-amber-500/15 animate-pulse">🏹</div>
        <div className="absolute top-80 right-1/4 text-5xl text-amber-700/20 animate-ping">⭐</div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Main Content */}
        <div className="text-center max-w-4xl">
          <h1 
            className="text-8xl font-bold text-amber-300 mb-8 tracking-wider drop-shadow-2xl"
            style={{
              fontFamily: 'serif',
              fontWeight: '900',
              letterSpacing: '0.15em',
              textShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.3), 2px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            Ashwood
          </h1>

          <p className="text-2xl text-amber-200 font-medium leading-relaxed mb-12">
            A tactical strategy onchain game where players command diverse armies across a 54-position battlefield, 
            with seasonal effects and supply chain mechanics.
          </p>

          <button 
            onClick={onStartGame}
            className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-600 
                      border-2 border-amber-500 rounded-xl font-bold text-xl
                      text-amber-100 hover:from-amber-600 hover:to-amber-500 
                      hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50
                      transition-all duration-300 transform"
            style={{
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
            }}
          >
            🎮 CONTINUE TO GAME 🎮
          </button>
        </div>
      </div>
    </div>
  );
};

export default TacticalCommandHomepage;
