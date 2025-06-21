import React, { useState } from 'react';
import { X, Users, Shield, Sword, Zap, Plus } from 'lucide-react';
import { useAllEntities } from '../utils/ash';

const AddUnitToArmyModal = ({ isOpen, onClose, onConfirm }) => {
  const [isAdding, setIsAdding] = useState(false);
   const { state, refetch } = useAllEntities();
  

  // Class icons
  const classIcons = {
    Infantry: '🛡️',
    Pike: '🔱', 
    Archer: '🏹',
    Cavalry: '🐎',
    Elite: '⭐',
    Support: '🏴'
  };

  const handleConfirm = async () => {
    if (!state.selectedUnit || !state.selectedArmy) return;
    
    setIsAdding(true);
    
    try {
      await onConfirm(state.selectedArmy.army_id, state.selectedUnit.id);
      onClose();
    } catch (error) {
      console.error('Failed to add unit to army:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      onClose();
    }
  };

  if (!isOpen || !state.selectedUnit || !state.selectedArmy) return null;

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
                <Plus className="text-amber-300" size={24} />
                <h2 className="text-xl font-bold text-amber-300">Add Unit to Army</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isAdding}
                className="p-1 rounded-lg hover:bg-amber-700/50 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="text-amber-300" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Confirmation Message */}
            <div className="text-center">
              <p className="text-amber-300 mb-4">
                Are you sure you want to add this unit to the army?
              </p>
            </div>

            {/* Unit Details */}
            <div className="bg-amber-800/40 border border-amber-600/50 rounded-lg p-4">
              <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
                <Users size={16} />
                Unit Details
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">Name:</span>
                  <span className="text-amber-200 font-medium">{state.selectedUnit.player_name || state.selectedUnit.player_name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">ID:</span>
                  <span className="text-amber-200 font-medium">{state.selectedUnit.id}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">Class:</span>
                  <span className="text-amber-200 font-medium flex items-center gap-1">
                    {classIcons[state.selectedUnit.unit_class as unknown as string]} {state.selectedUnit.unit_class}
                  </span>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-amber-600/30">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                      <Sword size={12} />
                    </div>
                    <div className="text-amber-200 text-sm font-bold">{state.selectedUnit.attack}</div>
                    <div className="text-amber-400 text-xs">ATK</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <Shield size={12} />
                    </div>
                    <div className="text-amber-200 text-sm font-bold">{state.selectedUnit.defense}</div>
                    <div className="text-amber-400 text-xs">DEF</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <Zap size={12} />
                    </div>
                    <div className="text-amber-200 text-sm font-bold">{state.selectedUnit.speed}</div>
                    <div className="text-amber-400 text-xs">SPD</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                      <span>✨</span>
                    </div>
                    <div className="text-amber-200 text-sm font-bold">{state.selectedUnit.special}</div>
                    <div className="text-amber-400 text-xs">SPC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Army Details */}
            <div className="bg-amber-800/40 border border-amber-600/50 rounded-lg p-4">
              <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
                🏰 Target Army
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">Name:</span>
                  <span className="text-amber-200 font-medium">{state.selectedArmy.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-amber-400">ID:</span>
                  <span className="text-amber-200 font-medium">{state.selectedArmy.army_id}</span>
                </div>
                
                {/* <div className="flex items-center justify-between">
                  <span className="text-amber-400">Current Units:</span>
                  <span className="text-amber-200 font-medium">{state.selectedArmy.unit_count || 0}/12</span>
                </div> */}
                
                {/* Capacity warning */}
                {/* {(state.selectedArmy.unit_count || 0) >= 11 && (
                  <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-600/50 rounded">
                    <p className="text-yellow-300 text-xs">
                      ⚠️ Army is near capacity limit
                    </p>
                  </div>
                )} */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                disabled={isAdding}
                className="flex-1 px-4 py-3 bg-amber-800/50 border-2 border-amber-600/50 
                          rounded-lg text-amber-300 font-medium hover:bg-amber-700/50 
                          hover:border-amber-500/70 transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={isAdding}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 
                          border-2 border-amber-500 rounded-lg text-amber-100 font-bold
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          transition-all duration-300 shadow-lg
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                          flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 
                                   rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Confirm Add
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

export default AddUnitToArmyModal;