import React, { useState } from 'react';
import { X, Sword, Users } from 'lucide-react';
import type { Army } from '@/dojogen/models.gen';

const CreateBattleModal = ({ isOpen, onClose, onSelectArmy, playerArmies }:{ isOpen: boolean, onClose: () => void, onSelectArmy: (selectedArmy: Army) => Promise<void>, playerArmies: Record<string, Army> }) => {
  const [selectedArmyId, setSelectedArmyId] = useState<number>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleArmySelect = (army) => {
    setSelectedArmyId(army.army_id);
  };

  const handleConfirm = async () => {
    if (!selectedArmyId) return;
    
    const selectedArmy = Object.values(playerArmies).find(a  => a.army_id  === selectedArmyId);
    if (!selectedArmy) return;
    
    setIsCreating(true);
    
    try {
      await onSelectArmy(selectedArmy);
      handleClose();
    } catch (error) {
      console.error('Failed to create battle:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setSelectedArmyId(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-amber-900/95 to-amber-800/95 
                       border-2 border-amber-600/70 rounded-xl shadow-2xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="bg-amber-800/60 border-b border-amber-600/50 p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sword className="text-amber-300" size={24} />
                <h2 className="text-xl font-bold text-amber-300">Select Army for Battle</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isCreating}
                className="p-1 rounded-lg hover:bg-amber-700/50 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="text-amber-300" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            {/* Army Selection */}
            {playerArmies && Object.keys(playerArmies).length > 0 ? (
              <div className="space-y-3">
                <p className="text-amber-300 text-sm mb-4">
                  Choose which army will enter battle:
                </p>
                
                {Object.values(playerArmies).map((army) => (
                  <button
                    key={army.army_id}
                    onClick={() => handleArmySelect(army)}
                    disabled={isCreating}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 
                              ${selectedArmyId === army.army_id
                                ? 'bg-amber-700/50 border-amber-500 text-amber-100 shadow-lg'
                                : 'bg-amber-800/30 border-amber-600/50 text-amber-300 hover:bg-amber-700/30 hover:border-amber-500/70'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="text-amber-400" size={20} />
                        <div>
                          <div className="font-bold text-lg">{army.name}</div>
                          <div className="text-sm opacity-80">Army ID: {army.army_id}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-amber-800/30 border border-amber-600/50 rounded-lg text-center">
                <p className="text-amber-400">No armies available</p>
                <p className="text-amber-500/70 text-sm mt-1">Create an army first</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                disabled={isCreating}
                className="flex-1 px-4 py-3 bg-amber-800/50 border-2 border-amber-600/50 
                          rounded-lg text-amber-300 font-medium hover:bg-amber-700/50 
                          hover:border-amber-500/70 transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={isCreating || !selectedArmyId}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 
                          border-2 border-amber-500 rounded-lg text-amber-100 font-bold
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          transition-all duration-300 shadow-lg
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                          flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 
                                   rounded-full animate-spin" />
                    Creating Battle...
                  </>
                ) : (
                  <>
                    <Sword size={16} />
                    Create Battle
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-amber-400/50 rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-amber-400/50 rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-amber-400/50 rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-amber-400/50 rounded-br-lg"></div>
        </div>
      </div>
    </div>
  );
};


export default CreateBattleModal;