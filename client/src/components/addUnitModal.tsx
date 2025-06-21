import React, { useState } from 'react';
import { X, Sword, Shield, Zap, Users } from 'lucide-react';

const AddUnitModal = ({ isOpen, onClose, onCreateUnit }) => {
  const [unitData, setUnitData] = useState({
    playerName: '',
    unitClass: 'Infantry',
    attack: 10,
    defense: 10,
    speed: 10,
    special: 5
  });
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  // Unit class enum - matches your contract
  const unitClasses = [
    'Infantry',
    'Pike', 
    'Archer',
    'Cavalry',
    'Elite',
    'Support'
  ];

  // Class icons and descriptions
  const classInfo = {
    Infantry: { icon: '🛡️', description: 'Balanced melee fighters', color: 'text-blue-400' },
    Pike: { icon: '🔱', description: 'Anti-cavalry specialists', color: 'text-purple-400' },
    Archer: { icon: '🏹', description: 'Ranged damage dealers', color: 'text-green-400' },
    Cavalry: { icon: '🐎', description: 'Fast mobile units', color: 'text-yellow-400' },
    Elite: { icon: '⭐', description: 'Superior warriors', color: 'text-red-400' },
    Support: { icon: '🏴', description: 'Utility and healing', color: 'text-cyan-400' }
  };

  // Stat point allocation system
  const totalPoints = 40;
  const usedPoints = unitData.attack + unitData.defense + unitData.speed + unitData.special;
  const remainingPoints = totalPoints - usedPoints;

  const validateForm = () => {
    const newErrors = {} as any;
    

    
    // Player name validation (felt252)
    if (!unitData.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    } else if (unitData.playerName.length < 2) {
      newErrors.playerName = 'Player name must be at least 2 characters';
    } else if (unitData.playerName.length > 31) {
      newErrors.playerName = 'Player name must be less than 32 characters';
    }
    
    // Stats validation (u8 - 0 to 10)
    const stats = ['attack', 'defense', 'speed', 'special'];
    stats.forEach(stat => {
      const value = unitData[stat];
      if (value < 1 || value > 10) {
        newErrors[stat] = `${stat} must be between 1 and 10`;
      }
    });
    
    // Point allocation validation
    if (remainingPoints < 0) {
      newErrors.points = 'Total stat points cannot exceed 40';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setUnitData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined, points: undefined }));
  };

  const handleStatChange = (stat, value) => {
    const numValue = Math.max(1, Math.min(10, parseInt(value) || 1));
    handleInputChange(stat, numValue);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsCreating(true);
    
    try {
      await onCreateUnit({
        playerName: unitData.playerName.trim(),
        unitClass: unitData.unitClass,
        attack: unitData.attack,
        defense: unitData.defense,
        speed: unitData.speed,
        special: unitData.special
      });
      
      // Reset form and close modal on success
      setUnitData({
        playerName: '',
        unitClass: 'Infantry',
        attack: 10,
        defense: 10,
        speed: 10,
        special: 5
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create unit:', error);
      setErrors({ submit: 'Failed to create unit. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setUnitData({
        playerName: '',
        unitClass: 'Infantry',
        attack: 10,
        defense: 10,
        speed: 10,
        special: 5
      });
      setErrors({});
      onClose();
    }
  };

  const adjustStat = (stat, delta) => {
    const currentValue = unitData[stat];
    const newValue = Math.max(1, Math.min(10, currentValue + delta));
    if (delta > 0 && remainingPoints <= 0) return; // Can't increase if no points left
    handleStatChange(stat, newValue);
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
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-amber-900/95 to-amber-800/95 
                       border-2 border-amber-600/70 rounded-xl shadow-2xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="bg-amber-800/60 border-b border-amber-600/50 p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-amber-300" size={24} />
                <h2 className="text-xl font-bold text-amber-300">Create New Unit</h2>
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
          <div className="p-6 space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* Player Name */}
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">
                  👤 Name
                </label>
                <input
                  type="text"
                  value={unitData.playerName}
                  onChange={(e) => handleInputChange('playerName', e.target.value)}
                  className="w-full px-4 py-3 bg-amber-900/50 border-2 border-amber-600/50 
                            rounded-lg text-amber-100 placeholder-amber-400/70 
                            focus:border-amber-500 focus:outline-none focus:ring-2 
                            focus:ring-amber-500/30 transition-all duration-200"
                  placeholder="Enter player name..."
                  maxLength={31}
                  disabled={isCreating}
                />
                {(errors as any).playerName && (
                  <p className="mt-1 text-sm text-red-400">{(errors as any).playerName}</p>
                )}
                <div className="mt-1 text-xs text-amber-400/70 text-right">
                  {unitData.playerName.length}/31 characters
                </div>
              </div>
            </div>

            {/* Unit Class Selection */}
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-3">
                ⚔️ Unit Class
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {unitClasses.map((unitClass) => (
                  <button
                    key={unitClass}
                    type="button"
                    onClick={() => handleInputChange('unitClass', unitClass)}
                    disabled={isCreating}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 
                              ${unitData.unitClass === unitClass
                                ? 'bg-amber-700/50 border-amber-500 text-amber-100'
                                : 'bg-amber-800/30 border-amber-600/50 text-amber-300 hover:bg-amber-700/30'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{classInfo[unitClass].icon}</div>
                      <div className="text-sm font-bold">{unitClass}</div>
                      <div className={`text-xs ${classInfo[unitClass].color}`}>
                        {classInfo[unitClass].description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Allocation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-amber-300">
                  📊 Stat Allocation
                </label>
                <div className={`text-sm font-bold ${remainingPoints < 0 ? 'text-red-400' : 'text-amber-300'}`}>
                  Points Remaining: {remainingPoints}/40
                </div>
              </div>
              
              {(errors as any).points && (
                <p className="mb-3 text-sm text-red-400">{(errors as any).points}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attack */}
                <div className="bg-amber-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sword className="text-red-400" size={16} />
                      <span className="text-amber-300 font-medium">Attack</span>
                    </div>
                    <span className="text-amber-100 font-bold">{unitData.attack}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustStat('attack', -1)}
                      disabled={isCreating || unitData.attack <= 1}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={unitData.attack}
                      onChange={(e) => handleStatChange('attack', e.target.value)}
                      disabled={isCreating}
                      className="flex-1"
                    />
                    <button
                      onClick={() => adjustStat('attack', 1)}
                      disabled={isCreating || unitData.attack >= 10 || remainingPoints <= 0}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Defense */}
                <div className="bg-amber-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="text-blue-400" size={16} />
                      <span className="text-amber-300 font-medium">Defense</span>
                    </div>
                    <span className="text-amber-100 font-bold">{unitData.defense}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustStat('defense', -1)}
                      disabled={isCreating || unitData.defense <= 1}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={unitData.defense}
                      onChange={(e) => handleStatChange('defense', e.target.value)}
                      disabled={isCreating}
                      className="flex-1"
                    />
                    <button
                      onClick={() => adjustStat('defense', 1)}
                      disabled={isCreating || unitData.defense >= 10 || remainingPoints <= 0}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Speed */}
                <div className="bg-amber-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="text-green-400" size={16} />
                      <span className="text-amber-300 font-medium">Speed</span>
                    </div>
                    <span className="text-amber-100 font-bold">{unitData.speed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustStat('speed', -1)}
                      disabled={isCreating || unitData.speed <= 1}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={unitData.speed}
                      onChange={(e) => handleStatChange('speed', e.target.value)}
                      disabled={isCreating}
                      className="flex-1"
                    />
                    <button
                      onClick={() => adjustStat('speed', 1)}
                      disabled={isCreating || unitData.speed >= 10 || remainingPoints <= 0}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Special */}
                <div className="bg-amber-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">✨</span>
                      <span className="text-amber-300 font-medium">Special</span>
                    </div>
                    <span className="text-amber-100 font-bold">{unitData.special}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustStat('special', -1)}
                      disabled={isCreating || unitData.special <= 1}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={unitData.special}
                      onChange={(e) => handleStatChange('special', e.target.value)}
                      disabled={isCreating}
                      className="flex-1"
                    />
                    <button
                      onClick={() => adjustStat('special', 1)}
                      disabled={isCreating || unitData.special >= 10 || remainingPoints <= 0}
                      className="px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-amber-100 
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {(errors as any).submit && (
              <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{(errors as any).submit}</p>
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
                onClick={handleSubmit}
                disabled={isCreating  || !unitData.playerName.trim() || remainingPoints < 0}
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
                    Creating Unit...
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    Create Unit
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


export default AddUnitModal;