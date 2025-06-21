import React, { useState, useCallback, useEffect } from "react";
import { useAshwoodStore } from './utils/ashwood';
import GameState from './utils/gamestate';;

import { useNetworkAccount } from "./context/WalletContex";
import AshwoodMainMenu from "./pages/MainMenu";
import BattleInterface from "./pages/Arena";

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("CONNECTING TO STADIUM");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const texts = [
          "CONNECTING TO STADIUM",
          "VERIFYING MANAGER CREDENTIALS",
          "LOADING SQUAD DATA",
          "PREPARING MATCH ENGINE",
          "CHECKING TOURNAMENT STATUS"
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
 <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 flex flex-col items-center justify-center">
   {/* Tactical Grid Background */}
   <div 
     className="absolute inset-0 opacity-5"
     style={{
       backgroundImage: `
         linear-gradient(to right, rgba(245, 158, 11, 0.3) 1px, transparent 1px),
         linear-gradient(to bottom, rgba(245, 158, 11, 0.3) 1px, transparent 1px)
       `,
       backgroundSize: '20px 20px'
     }}
   />
   
   {/* Floating Combat Icons */}
   <div className="absolute inset-0 overflow-hidden pointer-events-none">
     <div className="absolute top-20 left-20 text-4xl text-amber-600/10 animate-pulse">⚔️</div>
     <div className="absolute bottom-20 right-20 text-3xl text-amber-500/15 animate-bounce">🛡️</div>
     <div className="absolute top-40 right-32 text-5xl text-amber-700/10 animate-ping">🏰</div>
   </div>
   
   <div className="relative z-10 w-full max-w-md p-6">
     {/* Command Terminal Window */}
     <div className="bg-amber-900/50 backdrop-blur-sm border border-amber-400/30 rounded-lg overflow-hidden shadow-2xl">
       {/* Terminal Header */}
       <div className="bg-amber-800/50 px-4 py-2 border-b border-amber-400/30">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
           <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
         </div>
       </div>
       
       {/* Terminal Content */}
       <div className="p-4 font-mono text-sm">
         <div className="space-y-2">
           <p className="text-amber-300">
             - ASHWOOD_TACTICAL v1.0.0
           </p>
           <p className="text-amber-200/70">
             - INITIALIZING BATTLEFIELD COMMAND SEQUENCE...
           </p>
           <div className="flex items-center gap-2 text-amber-200">
             <div className="w-2 h-2 bg-amber-200 animate-pulse"></div>
             <span>{loadingText}{'.'.repeat(dots)}</span>
           </div>
           
           {/* Progress Bar */}
           <div className="mt-4 h-1 bg-amber-700/30 rounded-full overflow-hidden border border-amber-600/50">
             <div className="h-full bg-amber-300/50 animate-pulse" 
               style={{width: '60%'}}></div>
           </div>
           
           {/* Status Messages */}
           <div className="mt-4 space-y-1 text-xs text-amber-200/50">
             <p>{">"} TACTICAL GRID: LOADING</p>
             <p>{">"} COMMANDER VERIFICATION: IN PROGRESS</p>
             <p>{">"} BATTLEFIELD STATUS: OPERATIONAL</p>
             <p>{">"} UNIT DEPLOYMENT: READY</p>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
);
};

const InitGame = () => {
  const { account } = useNetworkAccount();
  const { game_state } = useAshwoodStore((state) => state);
  
  return (
    <>
      {account ? (
        <div className="bg-green-950 pb-4">
          {game_state === GameState.MainMenu && <AshwoodMainMenu />}
          {game_state === GameState.Arena && <BattleInterface />}

        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default InitGame;