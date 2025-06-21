import React from 'react';
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useUiSounds, soundSelector } from "../hooks/useUiSound";
import { useAshwoodStore } from "../utils/ashwood";
import { useNetwork } from "../context/NetworkContext";

interface IntroProps {
  onOnboardComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onOnboardComplete }) => {
  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setIsMuted,
    isMuted,
  } = useAshwoodStore();
  const { network } = useNetwork(); // Get the already selected network
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account, status } = useAccount();
  const cartridgeConnector = connectors[0];
  const { play: clickPlay } = useUiSounds(soundSelector.bg);

  // Handle continue button click
  const handleContinue = () => {
    // For mainnet/sepolia, check wallet connection
    if ((network === "mainnet" || network === "sepolia") && status !== "connected") {
      // Attempt to connect wallet
      connect({ connector: cartridgeConnector });
    } else {
      // For testnet or already connected wallets, proceed
      setScreen("start");
      handleOnboarded();
      onOnboardComplete();
      if (network !== "katana") {
        setLoginScreen(true);
      }
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
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
        <div className="absolute top-20 left-20 text-4xl text-amber-600/20 animate-bounce">⚔️</div>
        <div className="absolute top-40 right-32 text-3xl text-amber-500/30 animate-pulse">🛡️</div>
        <div className="absolute bottom-32 left-40 text-4xl text-amber-700/25 animate-ping">🏰</div>
        <div className="absolute bottom-20 right-20 text-2xl text-amber-600/20 animate-bounce">🐎</div>
        <div className="absolute top-60 left-1/4 text-3xl text-amber-500/15 animate-pulse">🏹</div>
        <div className="absolute top-80 right-1/3 text-4xl text-amber-700/20 animate-ping">⭐</div>
      </div>

      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            if (!isMuted) {
              //clickPlay(); // Only play sound if not muted
            }
            toggleSound();
          }}
          className="p-2 rounded-full bg-amber-800/50 border border-amber-500/30 
                   text-amber-300 hover:bg-amber-700/50 hover:border-amber-400/30 transition-all duration-200"
        >
          {isMuted ? (
            <span className="text-xl">🔇</span>
          ) : (
            <span className="text-xl">🔊</span>
          )}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-6xl sm:text-8xl font-bold text-amber-300 tracking-wider drop-shadow-2xl text-center"
            style={{
              fontFamily: 'serif',
              fontWeight: '900',
              letterSpacing: '0.15em',
              textShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.3), 2px 2px 4px rgba(0,0,0,0.8)'
            }}>
          ASHWOOD
        </h1>
        
        {/* Main Content Panel */}
        <div className="w-full max-w-3xl bg-gradient-to-br from-amber-900/60 to-amber-800/60 
                        border-2 border-amber-600 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          
          <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center tracking-wide"
              style={{ fontFamily: 'serif' }}>
            🏛️ COMMANDER BRIEFING
          </h2>
          
          <div className="space-y-4 text-amber-100 text-lg leading-relaxed">
            <p>
              Welcome, Commander. You have been chosen to lead forces in the realm of Ashwood, 
              where tactical brilliance determines the fate of kingdoms.
            </p>
            <p>
              Your mission: Deploy diverse armies across a 54-position battlefield, master seasonal warfare, 
              and outmaneuver your enemies through strategic positioning and supply chain mastery.
            </p>
            <p className="text-amber-200 font-medium">
              The battlefield awaits your command. Will you rise to become a legendary tactician?
            </p>
          </div>
          
          {/* Battlefield Preview */}
          <div className="w-full bg-amber-900/40 rounded-lg p-4 my-6 border border-amber-600/50">
            <div className="flex items-center justify-center mb-3">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} 
                       className="w-12 h-12 bg-amber-700/40 border-2 border-amber-500 
                                 rounded-lg flex items-center justify-center text-lg
                                 hover:scale-110 transition-transform duration-200">
                    {i % 3 === 0 ? '🛡️' : i % 3 === 1 ? '🐎' : '⚔️'}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-amber-300/80 font-medium tracking-wider">
              TACTICAL OVERVIEW: BATTLEFIELD GRID SYSTEM
            </p>
          </div>

          {/* Network Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-700/50 border border-amber-500/30">
                <div className={`w-3 h-3 rounded-full ${
                  network === "mainnet" ? "bg-emerald-500" : 
                  network === "sepolia" ? "bg-blue-500" : "bg-amber-500"
                } animate-pulse`} />
                <span className="text-sm font-medium uppercase tracking-wider text-amber-300">
                  {network === "mainnet" ? "MAINNET" : 
                   network === "sepolia" ? "SEPOLIA" : "KATANA"}
                </span>
              </div>
              
              {(network === "mainnet" || network === "sepolia") && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  status === "connected" 
                    ? "bg-green-700/50 text-green-300 border-green-500/30" 
                    : "bg-amber-900/50 text-amber-300 border-amber-600/30"
                }`}>
                  {status === "connected" ? "🗡️ COMMANDER VERIFIED" : "⚡ VERIFICATION REQUIRED"}
                </div>
              )}
            </div>
          </div>
          
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-amber-700 to-amber-600 
                      text-amber-100 font-bold text-xl tracking-wider 
                      border-2 border-amber-500 rounded-xl shadow-2xl shadow-amber-900/30
                      transition-all duration-300 hover:from-amber-600 hover:to-amber-500 
                      hover:scale-105 hover:shadow-amber-500/50 active:scale-95"
            style={{
              fontFamily: 'serif',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)'
            }}>
            {(network === "mainnet" || network === "sepolia") && status !== "connected" 
              ? "🔗 CONNECT TO REALM" 
              : "⚔️ ENTER THE BATTLEFIELD ⚔️"}
          </button>
        </div>

        {/* Bottom decorative elements */}
        <div className="flex items-center gap-6 mt-4 opacity-60">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">🏹</span>
            <span className="text-sm font-medium">TACTICAL</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">⚔️</span>
            <span className="text-sm font-medium">STRATEGIC</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-2xl">🏰</span>
            <span className="text-sm font-medium">ONCHAIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;