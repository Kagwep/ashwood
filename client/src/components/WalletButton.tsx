import React, { useState } from 'react';
import { shortAddress } from '../utils/sanitizer';
import { Wallet, Copy, Check } from 'lucide-react';
import { Button } from './UI/button';
import { useDojo } from '../dojo/useDojo';
import { useAshwoodStore } from '../utils/ashwood';
import { useNetworkAccount } from '../context/WalletContex';

const WalletButton = () => {
  const { account, address, status, isConnected } = useNetworkAccount();
  const { isWalletPanelOpen, setWalletPanelOpen } = useAshwoodStore((state) => state);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent wallet panel from opening
    
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setCopied(true);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = account.address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    }
  };

  const handleButtonClick = () => {
    setWalletPanelOpen(!isWalletPanelOpen);
  };

  return (
    <div className="relative">
      <button 
        className="p-3 flex items-center gap-3 bg-gradient-to-r from-amber-800 to-amber-700 
                  hover:from-amber-700 hover:to-amber-600 border-2 border-amber-600/70 
                  hover:border-amber-500 rounded-lg font-medium text-amber-100 
                  transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105
                  backdrop-blur-sm"
        onClick={handleButtonClick}
      >
        <Wallet size={16} className="text-amber-300" />
        <p className="font-mono text-sm font-bold">
          {account?.address ? shortAddress(account?.address) : 'Connect Wallet'}
        </p>
        
        {/* Copy button - only show when connected */}
        {account?.address && (
          <button
            onClick={handleCopyAddress}
            className="ml-1 p-1 rounded-md hover:bg-amber-600/50 transition-all duration-200
                      border border-amber-500/30 hover:border-amber-400/50"
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? (
              <Check size={12} className="text-amber-300 animate-pulse" />
            ) : (
              <Copy size={12} className="text-amber-300 hover:text-amber-200" />
            )}
          </button>
        )}
      </button>
      
      {copied && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 
                       bg-gradient-to-r from-amber-700 to-amber-600 border border-amber-500
                       text-amber-100 text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 
                       shadow-lg font-medium backdrop-blur-sm">
          ⚔️ Address copied to treasury!
          {/* Arrow pointing up */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                         border-l-4 border-r-4 border-b-4 border-transparent border-b-amber-600">
          </div>
        </div>
      )}
      
      {/* Medieval-style decorative elements */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-amber-400/50 rounded-tl-sm"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 border-r-2 border-t-2 border-amber-400/50 rounded-tr-sm"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l-2 border-b-2 border-amber-400/50 rounded-bl-sm"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-amber-400/50 rounded-br-sm"></div>
    </div>
  );
};

export default WalletButton;