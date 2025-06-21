import React, { useState } from 'react';
import { X, Sword, Shield, Users } from 'lucide-react';


const CreateArmyModal = ({ isOpen, onClose, onCreateArmy }) => {
  const [armyName, setArmyName] = useState('');
  const [armyId, setArmyId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});



  // Army name suggestions for inspiration
  const nameSuggestions = [
    "Iron Legion", "Golden Phalanx", "Storm Vanguard", "Steel Brotherhood",
    "Ember Guard", "Thunder Battalion", "Shadow Company", "Royal Cavalry"
  ];

  const validateForm = () => {
    const newErrors = {} as any;
    
    if (!armyName.trim()) {
      newErrors.armyName = 'Army name is required';
    } else if (armyName.length < 3) {
      newErrors.armyName = 'Army name must be at least 3 characters';
    } else if (armyName.length > 31) {
      newErrors.armyName = 'Army name must be less than 32 characters';
    }
    

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsCreating(true);
    
    try {
      // Convert army name to felt252 format (simplified for demo)
      const nameAsFelt252 = armyName.trim();
      
      
      await onCreateArmy(nameAsFelt252);
      
      // Reset form and close modal on success
      setArmyName('');
      setArmyId('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to create army:', error);
      setErrors({ submit: 'Failed to create army. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleNameSuggestion = (suggestion) => {
    setArmyName(suggestion);
    setErrors(prev => ({ ...prev, armyName: undefined }));
  };

  const handleClose = () => {
    if (!isCreating) {
      setArmyName('');
      setArmyId('');
      setErrors({});
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
                <h2 className="text-xl font-bold text-amber-300">Create New Army</h2>
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
            
            {/* Army Name Input */}
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-2">
                🏰 Army Name
              </label>
              <input
                type="text"
                value={armyName}
                onChange={(e) => {
                  setArmyName(e.target.value);
                  setErrors(prev => ({ ...prev, armyName: undefined }));
                }}
                className="w-full px-4 py-3 bg-amber-900/50 border-2 border-amber-600/50 
                          rounded-lg text-amber-100 placeholder-amber-400/70 
                          focus:border-amber-500 focus:outline-none focus:ring-2 
                          focus:ring-amber-500/30 transition-all duration-200"
                placeholder="Enter your army's name..."
                maxLength={31}
                disabled={isCreating}
              />
              {(errors as any).armyName && (
                <p className="mt-1 text-sm text-red-400">{(errors as any).armyName}</p>
              )}
              
              {/* Character count */}
              <div className="mt-1 text-xs text-amber-400/70 text-right">
                {armyName.length}/31 characters
              </div>
            </div>

            {/* Name Suggestions */}
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-2">
                💡 Suggested Names
              </label>
              <div className="grid grid-cols-2 gap-2">
                {nameSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleNameSuggestion(suggestion)}
                    disabled={isCreating}
                    className="px-3 py-2 text-xs bg-amber-800/50 border border-amber-600/50 
                              rounded-lg text-amber-200 hover:bg-amber-700/50 
                              hover:border-amber-500/70 transition-all duration-200
                              disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestion}
                  </button>
                ))}
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
                type="button"
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
                disabled={isCreating || !armyName.trim()}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    Create Army
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

export default CreateArmyModal;