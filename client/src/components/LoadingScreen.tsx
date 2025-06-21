import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ message = "Loading Ashwood Tactical Battlefield..." }) => {
  const [dots, setDots] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing battlefield systems');
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(0);

  const tips = [
    "Elite units can move 1-2 tiles in any direction for maximum tactical flexibility!",
    "Control middle positions (5, 14, 23, 32, 41, 50) for strategic deployment advantages.",
    "Winter favors Pike formations while Summer enhances Archer effectiveness.",
    "Supply chain connections are crucial - units must maintain adjacency to friendly forces.",
    "Seasonal positioning unlocks different battlefield areas - plan your deployments wisely!"
  ];

  const statusMessages = [
    'Initializing battlefield systems',
    'Loading army compositions',
    'Calculating seasonal effects',
    'Establishing supply chains',
    'Preparing tactical grid'
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const messageInterval = setInterval(() => {
      setStatusMessage(prev => {
        const currentIndex = statusMessages.indexOf(prev);
        return statusMessages[(currentIndex + 1) % statusMessages.length];
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress > 99 ? 99 : newProgress;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setShowTip(prev => (prev + 1) % tips.length);
    }, 4000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`
             }} />
      </div>

      {/* Floating Combat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl text-amber-600/20 animate-pulse">⚔️</div>
        <div className="absolute bottom-20 right-20 text-5xl text-amber-500/30 animate-bounce">🛡️</div>
        <div className="absolute top-40 right-32 text-4xl text-amber-700/25 animate-ping">🏰</div>
        <div className="absolute bottom-32 left-40 text-3xl text-amber-600/20 animate-pulse" style={{animationDelay: "1s"}}>🐎</div>
        <div className="absolute top-60 left-1/3 text-4xl text-amber-500/15 animate-bounce" style={{animationDelay: "0.5s"}}>🏹</div>
        <div className="absolute bottom-60 right-1/4 text-5xl text-amber-700/20 animate-ping" style={{animationDelay: "1.5s"}}>⭐</div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-3xl bg-gradient-to-br from-amber-900/60 to-amber-800/60 backdrop-blur-md rounded-xl border-2 border-amber-600 p-8 space-y-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">⚔️</div>
            <div>
              <h1 className="text-4xl font-bold text-amber-300"
                  style={{
                    fontFamily: 'serif',
                    textShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
                  }}>
                ASHWOOD
              </h1>
              <p className="text-amber-400 text-sm font-medium tracking-wider">TACTICAL BATTLEFIELD</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{animationDelay: "0.2s"}}></div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{animationDelay: "0.4s"}}></div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-r from-amber-600 to-amber-400 w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-500">
              <div className="text-2xl animate-spin">⚡</div>
            </div>
          </div>
          <div className="text-amber-100 font-medium text-xl text-center">
            {statusMessage}{dots}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="h-4 bg-amber-900/60 rounded-full overflow-hidden p-0.5 border border-amber-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-200 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-amber-200">
            <span>BATTLEFIELD PREPARATION</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Tip box */}
        <div className="bg-amber-900/40 rounded-lg p-6 border-2 border-amber-600/50">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-800/60 p-3 rounded-lg border border-amber-600">
              <div className="text-xl">🎯</div>
            </div>
            <div>
              <h3 className="text-amber-300 font-bold mb-2 text-lg">TACTICAL INSIGHT</h3>
              <p className="text-amber-100/90 text-sm leading-relaxed">
                {tips[showTip]}
              </p>
            </div>
          </div>
        </div>

        {/* System messages */}
        <div className="px-4 py-3 font-mono text-xs space-y-2 border-t border-amber-600/50 pt-6">
          <p className="text-amber-300/90 flex items-center">
            <span className="inline-block w-4 text-amber-400 mr-2">⚡</span> 
            <span className="opacity-90">Deploying battlefield grid systems...</span>
          </p>
          <p className="text-amber-300/70 flex items-center">
            <span className="inline-block w-4 text-amber-400 mr-2">⚡</span> 
            <span className="opacity-70">Synchronizing unit databases...</span>
          </p>
          <p className="text-amber-300/50 flex items-center">
            <span className="inline-block w-4 text-amber-400 mr-2">⚡</span> 
            <span className="opacity-50">Awaiting commander orders...</span>
          </p>
        </div>

        {/* Battle Grid Preview */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2 p-4 bg-amber-900/30 rounded-lg border border-amber-600/30">
            {[...Array(9)].map((_, i) => (
              <div key={i} 
                   className="w-8 h-8 bg-amber-700/40 border border-amber-500 
                             rounded flex items-center justify-center text-sm
                             animate-pulse"
                   style={{animationDelay: `${i * 0.1}s`}}>
                {i % 3 === 0 ? '🛡️' : i % 3 === 1 ? '⚔️' : '🏹'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-6 text-amber-300/70 text-sm font-medium flex items-center">
        <span className="text-lg mr-2">🏰</span>
        {message}
      </div>
    </div>
  );
};

export default LoadingScreen;