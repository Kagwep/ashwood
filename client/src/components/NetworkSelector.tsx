import React from 'react';
import { type Network } from "../utils/ashwood";

interface NetworkSelectorProps {
  onNetworkSelected: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkSelected }) => {
  // Handle server selection
  const handleServerSelect = (selectedNetwork: Network) => {
    onNetworkSelected(selectedNetwork);
  };

  const ServerBadge = ({ type, name }: { type: string, name: string }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-700/50 border border-amber-500/30">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          type === "mainnet" ? "bg-emerald-500" : 
          type === "sepolia" ? "bg-blue-500" : "bg-amber-500"
        }`} />
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
          {name}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 flex flex-col items-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="h-full w-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`
             }} />
      </div>

      {/* Floating Combat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl text-amber-600/15 animate-pulse">🏰</div>
        <div className="absolute bottom-20 right-10 text-5xl text-amber-500/15 animate-pulse" style={{animationDelay: "1.5s"}}>⚔️</div>
        <div className="absolute top-40 right-40 text-4xl text-amber-700/15 animate-pulse" style={{animationDelay: "0.8s"}}>🛡️</div>
        <div className="absolute bottom-40 left-40 text-6xl text-amber-600/10 animate-pulse" style={{animationDelay: "2s"}}>⭐</div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 text-center">
          <span className="text-4xl">⚔️</span>
          <h1 className="text-5xl sm:text-6xl font-bold text-amber-300"
              style={{
                fontFamily: 'serif',
                textShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
              }}>
            ASHWOOD
          </h1>
        </div>
        
        <h2 className="text-xl text-amber-200 font-medium tracking-wide flex items-center">
          <span className="text-2xl mr-3">🏛️</span>
          SELECT YOUR BATTLEFIELD REALM
        </h2>

        <div className={`grid grid-cols-1 ${
            import.meta.env.VITE_SEPOLIA === 'false' 
              ? 'md:grid-cols-3' 
              : 'md:grid-cols-2'
          } gap-6 w-full mt-8`}>
          
          {/* Mainnet Card */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-amber-800/70 to-amber-900/70 border-2 border-amber-600/50 backdrop-blur-sm
            transition-all duration-300 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-900/30 group">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="mainnet" name="MAINNET" />
                <div className="text-3xl">🏆</div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-300 mb-2">Elite Battleground</h3>
                <p className="text-amber-100/90 text-base leading-relaxed">
                  Command armies in the ultimate theater of war. Face legendary tacticians with real stakes 
                  in the most prestigious battlefield realm.
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  disabled
                  onClick={() => handleServerSelect("mainnet")}
                  className="w-full py-4 bg-amber-600/50 text-amber-300 font-bold tracking-wider 
                  border-2 border-amber-700 rounded-lg shadow-lg 
                  transition-all duration-300 cursor-not-allowed opacity-60"
                >
                  DEPLOY FORCES
                </button>
                <p className="text-xs text-amber-400/70 text-center font-medium">Currently Sealed</p>
              </div>
            </div>
          </div>

          {/* Sepolia Card */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-amber-800/70 to-amber-900/70 border-2 border-amber-600/50 backdrop-blur-sm
            transition-all duration-300 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-900/30 group hover:scale-105">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="sepolia" name="SEPOLIA" />
                <div className="text-3xl">🎖️</div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-300 mb-2">Training Grounds</h3>
                <p className="text-amber-100/90 text-base leading-relaxed">
                  Hone your tactical skills in competitive warfare without mortal consequences. 
                  Perfect for aspiring commanders seeking glory.
                </p>
              </div>
              <button
                onClick={() => handleServerSelect("sepolia")}
                className="mt-auto w-full py-4 bg-gradient-to-r from-amber-700 to-amber-600 
                          text-amber-100 font-bold tracking-wider border-2 border-amber-500
                          rounded-lg shadow-2xl transition-all duration-300 
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          hover:shadow-amber-500/50 active:scale-95"
              >
                ⚔️ ENTER BATTLE ⚔️
              </button>
            </div>
          </div>

          {/* Testnet Card */}
          {import.meta.env.VITE_SEPOLIA === 'false' && (
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-amber-800/70 to-amber-900/70 border-2 border-amber-600/50 backdrop-blur-sm
          transition-all duration-300 hover:border-amber-400/70 hover:shadow-2xl hover:shadow-amber-900/30 group hover:scale-105">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="testnet" name="KATANA" />
                <div className="text-3xl">🗡️</div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-amber-300 mb-2">Practice Arena</h3>
                <p className="text-amber-100/90 text-base leading-relaxed">
                  Master the fundamentals of tactical warfare in a risk-free environment. 
                  Learn unit positioning and seasonal strategies.
                </p>
              </div>
              <button
                onClick={() => handleServerSelect("katana")}
                className="mt-auto w-full py-4 bg-gradient-to-r from-amber-700 to-amber-600 
                          text-amber-100 font-bold tracking-wider border-2 border-amber-500
                          rounded-lg shadow-2xl transition-all duration-300 
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          hover:shadow-amber-500/50 active:scale-95"
              >
                🛡️ BEGIN TRAINING 🛡️
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Bottom decorative elements */}
        <div className="flex items-center gap-8 mt-8 opacity-60">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">⚔️</span>
            <span className="text-sm font-medium">TACTICAL</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">🏰</span>
            <span className="text-sm font-medium">STRATEGIC</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium">ONCHAIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSelector;