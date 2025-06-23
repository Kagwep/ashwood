import React, { useState } from 'react';
import { X, AlertTriangle, Info, Move, Sword, Shield } from 'lucide-react';

const GameRulesModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('movement');

  if (!isOpen) return null;

  const unitClasses = [
    {
      name: 'Infantry',
      icon: '🪖',
      movement: '1 tile orthogonal',
      description: 'Versatile foot soldiers',
      seasonal: 'Struggles in winter, steady in other seasons'
    },
    {
      name: 'Pike',
      icon: '🔱',
      movement: '1 tile forward only',
      description: 'Spear formation units',
      seasonal: 'Defensive powerhouse in winter'
    },
    {
      name: 'Archer',
      icon: '🏹',
      movement: '1 tile orthogonal',
      description: 'Ranged combat specialists',
      seasonal: 'Dominates summer conditions'
    },
    {
      name: 'Cavalry',
      icon: '🐎',
      movement: 'Exactly 2 tiles orthogonal',
      description: 'Fast strike force (no jumping)',
      seasonal: 'Powerful in summer, nearly useless in winter'
    },
    {
      name: 'Elite',
      icon: '⭐',
      movement: '1-2 tiles any direction',
      description: 'Versatile hero units',
      seasonal: 'Adaptable across all seasons'
    },
    {
      name: 'Support',
      icon: '🏴',
      movement: '1 tile any direction',
      description: 'Battlefield assistance and healing',
      seasonal: 'Essential in harsh conditions'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 
                      border-2 border-amber-600 rounded-lg shadow-2xl 
                      max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-600">
          <h2 className="text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Ashwood Battle Rules
          </h2>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-amber-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Bug Notice */}
        <div className="bg-red-900/80 border border-red-500 m-4 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-red-200">Known Issue - Feedback Bug</span>
          </div>
          <p className="text-red-200 text-sm">
            If your action shows "success" in the toast but nothing changes on the battlefield, 
            you have violated game rules and the contract rejected your move. (We're fixing the 
            feedback issue) that prevents proper error messages.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-600 mx-4">
          <button
            onClick={() => setActiveTab('movement')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'movement'
                ? 'text-amber-100 border-b-2 border-amber-400'
                : 'text-amber-300 hover:text-amber-100'
            }`}>
            <Move className="w-4 h-4 inline mr-2" />
            Movement Rules
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'general'
                ? 'text-amber-100 border-b-2 border-amber-400'
                : 'text-amber-300 hover:text-amber-100'
            }`}>
            <Info className="w-4 h-4 inline mr-2" />
            General Rules
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {activeTab === 'movement' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-amber-200 mb-4">Unit Movement Rules</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unitClasses.map((unit) => (
                  <div key={unit.name} className="bg-amber-800/40 border border-amber-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{unit.icon}</span>
                      <h4 className="font-semibold text-amber-100">{unit.name}</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-200 font-medium">{unit.movement}</span>
                      </div>
                      
                      <p className="text-amber-300">{unit.description}</p>
                      
                      <div className="text-xs text-amber-400 italic">
                        {unit.seasonal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-700/40 border border-amber-500 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-amber-100 mb-2">Movement Definitions:</h4>
                <ul className="text-sm text-amber-200 space-y-1">
                  <li><strong>Orthogonal:</strong> Up, Down, Left, Right only (no diagonals)</li>
                  <li><strong>Any direction:</strong> Including diagonal movement</li>
                  <li><strong>No jumping:</strong> Cannot move through occupied tiles</li>
                  <li><strong>Forward only:</strong> Pike units are very directional</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-amber-200">General Battle Rules</h3>
              
              <div className="space-y-4">
                <div className="bg-amber-800/40 border border-amber-600 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-100 mb-2">🏟️ Battlefield Structure</h4>
                  <ul className="text-sm text-amber-200 space-y-1">
                    <li>• 6 battlefields with 9 positions each (54 total)</li>
                    <li>• Invader zone: Positions 1-27 (first 3 battlefields)</li>
                    <li>• Defender zone: Positions 28-54 (last 3 battlefields)</li>
                  </ul>
                </div>

                <div className="bg-amber-800/40 border border-amber-600 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-100 mb-2">🌟 Season Rules</h4>
                  <ul className="text-sm text-amber-200 space-y-1">
                    <li>• <span className="text-red-300">Odd Season:</span> Only odd-numbered positions available</li>
                    <li>• <span className="text-green-300">Even Season:</span> Only even-numbered positions available</li>
                    <li>• <span className="text-purple-300">Prime Season:</span> Only prime-numbered positions (2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53)</li>
                    <li>• 8 turns per season</li>
                  </ul>
                </div>

                <div className="bg-amber-800/40 border border-amber-600 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-100 mb-2">⚔️ Combat Rules</h4>
                  <ul className="text-sm text-amber-200 space-y-1">
                    <li>• Turn-based: Players alternate turns</li>
                    <li>• Can only move/attack with your own units</li>
                    <li>• Cannot attack your own units</li>
                    <li>• Units can only be deployed once per battlefield</li>
                    <li>• Eliminated units are removed (position freed)</li>
                    <li>• Use "Combat Mode" to attack enemy units</li>
                  </ul>
                </div>

                <div className="bg-red-800/40 border border-red-500 rounded-lg p-4">
                  <h4 className="font-semibold text-red-200 mb-2">❌ Common Rule Violations</h4>
                  <ul className="text-sm text-red-200 space-y-1">
                    <li>• Moving to positions not allowed in current season</li>
                    <li>• Moving units beyond their movement capability</li>
                    <li>• Acting on opponent's turn</li>
                    <li>• Deploying outside your zone</li>
                    <li>• Using eliminated units</li>
                    <li>• Moving through occupied positions (Cavalry)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-amber-600 p-4 bg-amber-900/60">
          <div className="text-center text-amber-300 text-sm">
            Remember: If success toast appears but battlefield doesn't update, you violated a rule!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRulesModal;