import React, { useCallback, useMemo } from 'react';
import { tacticalDeck } from '../utils/carddeck';
import { 
  useBattleStore, 
  useGameState, 
  useSelectedCard, 
  useForces, 
  useGlobalPositionRecord,
  useAddCard,
  useSelectCard,
  useDeployCard,
  useUpdateGameState,
  useNextTurn,
  useResetGame,
  useIsPositionOccupied,
  // Engagement hooks
  useEngageMode,
  useEngagingUnit,
  useTargetUnit,
  useToggleEngageMode,
  useSetEngagingUnit,
  useSetTargetUnit,
  useExecuteEngagement,
  useHandleMove
} from '../store';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojo } from '../dojo/useDojo';
import { Account, CairoCustomEnum } from 'starknet';
import { toast } from 'react-toastify';

// Types (keep existing ones)
interface Card {
  id: number;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  class: 'Infantry' | 'Cavalry' | 'Archer' | 'Pike' | 'Support' | 'Elite';
  deployed: boolean;
  attackBonus: number;
  defenseBonus: number;
  speedBonus: number;
  instanceId: string;
}

interface GridPosition {
  battlefieldId: number;
  position: number;
  globalPosition: number;
  card: Card | null;
}

// Constants (keep all existing constants)
const BATTLEFIELD_COUNT = 6;
const POSITIONS_PER_BATTLEFIELD = 9;
const TOTAL_POSITIONS = BATTLEFIELD_COUNT * POSITIONS_PER_BATTLEFIELD;
const TURNS_PER_SEASON = 8;

const SEASON_COLORS = {
  odd: 'bg-red-900/90 border-yellow-700',      // Deep crimson with gold trim (royal/winter)
  even: 'bg-emerald-800/90 border-amber-600',  // Rich green with warm amber (spring/summer)
  prime: 'bg-indigo-900/90 border-silver-500'  // Royal indigo with silver (mystical/rare)
};


const SEASON_LABELS = {
  odd: '🔵 Odd Season',
  even: '🟢 Even Season',
  prime: '🟣 Prime Season'
};

const CLASS_ICONS = {
  Infantry: '🛡️',
  Cavalry: '🐎',
  Archer: '🏹',
  Pike: '🔱',
  Support: '🏴',
  Elite: '⭐'
};

const BATTLEFIELD_LABELS = [
  'Northern Front', 'Eastern Theater', 'Central Command',
  'Western Flank', 'Southern Defense', 'Reserve Forces'
];

const POSITION_LABELS = ['BL', 'BC', 'BR', 'ML', 'MC', 'MR', 'FL', 'FC', 'FR'];
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];

// Utility functions (keep existing ones)
const getTurnsLeftInSeason = (turn: number): number => {
  return TURNS_PER_SEASON - ((turn - 1) % TURNS_PER_SEASON);
};

const getAvailablePositions = (season: 'odd' | 'even' | 'prime'): number[] => {
  const allPositions = Array.from({ length: TOTAL_POSITIONS }, (_, i) => i + 1);
  
  switch (season) {
    case 'odd':
      return allPositions.filter(pos => pos % 2 === 1);
    case 'even':
      return allPositions.filter(pos => pos % 2 === 0);
    case 'prime':
      return PRIME_NUMBERS;
    default:
      return allPositions;
  }
};

const getCardBackgroundImage = (card: any, playerId: number) => {
  if (!card) return '';
  const className = card.class.toLowerCase();
  return `/images/cards/${className}${playerId}.png`;
};

const getAdjacentPositions = (globalPos: number): number[] => {
  const battlefieldId = Math.floor(globalPos / POSITIONS_PER_BATTLEFIELD);
  const localPos = globalPos % POSITIONS_PER_BATTLEFIELD;
  const row = Math.floor(localPos / 3);
  const col = localPos % 3;
  
  const adjacent: number[] = [];
  
  // Adjacent within same battlefield
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue;
      
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newLocalPos = newRow * 3 + newCol;
        const newGlobalPos = battlefieldId * POSITIONS_PER_BATTLEFIELD + newLocalPos;
        adjacent.push(newGlobalPos);
      }
    }
  }
  
  // Cross-battlefield connections
  const connectionMap: Record<number, number> = {
    8: 9, 9: 8, 17: 18, 18: 17, 26: 27, 27: 26, 35: 36, 36: 35, 44: 45, 45: 44
  };
  
  if (connectionMap[globalPos] !== undefined) {
    adjacent.push(connectionMap[globalPos]);
  }
  
  return adjacent;
};

const BattleInterface: React.FC = () => {
  // Zustand store hooks
  const gameState = useGameState();
  const selectedCard = useSelectedCard();
  const forces = useForces();
  const globalPositionRecord = useGlobalPositionRecord();
  
  // Individual action hooks
  const addCard = useAddCard();
  const selectCard = useSelectCard();
  const deployCard = useDeployCard();
  const updateGameState = useUpdateGameState();
  const nextTurn = useNextTurn();
  const resetGame = useResetGame();
  const isPositionOccupied = useIsPositionOccupied();
  
  // Engagement system hooks
  const engageMode = useEngageMode();
  const engagingUnit = useEngagingUnit();
  const targetUnit = useTargetUnit();
  const toggleEngageMode = useToggleEngageMode();
  const setEngagingUnit = useSetEngagingUnit();
  const setTargetUnit = useSetTargetUnit();
  const executeEngagement = useExecuteEngagement();
  const handleMove = useHandleMove();

  // Memoized values
  const availablePositions = useMemo(() => 
    getAvailablePositions(gameState.currentSeason), 
    [gameState.currentSeason]
  );

  const tacticalDeckArray = useMemo(() => 
    Object.entries(tacticalDeck).map(([id, data]) => ({ id: parseInt(id), ...data })),
    []
  );

  // Create battlefields from global position record
  const battlefields = useMemo((): GridPosition[][] => {
    return Array.from({ length: BATTLEFIELD_COUNT }, (_, battlefieldId) =>
      Array.from({ length: POSITIONS_PER_BATTLEFIELD }, (_, position) => {
        const globalPosition = battlefieldId * POSITIONS_PER_BATTLEFIELD + position;
        return {
          battlefieldId,
          position,
          globalPosition,
          card: globalPositionRecord[globalPosition] || null
        };
      })
    );
  }, [globalPositionRecord]);

  // Helper functions
  const createCardFromTemplate = useCallback((template: typeof tacticalDeck[1] & { id: number }): Card => {
    const instanceId = `${template.id}-${Date.now()}-${Math.random()}`;
    return {
      ...template,
      deployed: false,
      attackBonus: 0,
      defenseBonus: 0,
      speedBonus: 0,
      instanceId
    } as any;
  }, []);

  const isPositionAvailable = useCallback((globalPosition: number): boolean => {
    return availablePositions.includes(globalPosition + 1);
  }, [availablePositions]);

  const isSupplyChainValid = useCallback((battlefieldId: number, position: number): boolean => {
    const battlefield = battlefields[battlefieldId];
    const existingUnits = battlefield.filter(slot => slot.card !== null);
    
    if (existingUnits.length === 0) return true;
    
    const row = Math.floor(position / 3);
    const col = position % 3;
    
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) continue;
        
        const adjRow = row + dRow;
        const adjCol = col + dCol;
        
        if (adjRow >= 0 && adjRow < 3 && adjCol >= 0 && adjCol < 3) {
          const adjPosition = adjRow * 3 + adjCol;
          const adjSlot = battlefield[adjPosition];
          
          if (adjSlot?.card) return true;
        }
      }
    }
    
    return false;
  }, [battlefields]);

  const calculatePositioningBonuses = useCallback((battlefields: GridPosition[][]) => {
    const flatBattlefield = battlefields.flat();
    
    return flatBattlefield.map(slot => {
      if (!slot.card) return slot;
      
      const adjacentPositions = getAdjacentPositions(slot.globalPosition);
      let attackBonus = 0;
      let defenseBonus = 0;
      let speedBonus = 0;
      
      adjacentPositions.forEach(adjPos => {
        const adjSlot = flatBattlefield[adjPos];
        if (adjSlot?.card) {
          // Combat advantage/disadvantage
          if (slot.card!.attack > adjSlot.card.defense) {
            attackBonus += 5;
          } else if (slot.card!.attack < adjSlot.card.defense) {
            attackBonus -= 3;
          }
          
          // Speed advantage
          if (slot.card!.speed > adjSlot.card.speed) {
            speedBonus += 3;
          }
          
          // Class synergy
          if (slot.card!.class === adjSlot.card.class) {
            defenseBonus += 5;
          }
          
          // Support bonuses
          if (slot.card!.class === 'Support') {
            attackBonus += 2;
            defenseBonus += 2;
            speedBonus += 2;
          }
          
          if (adjSlot.card.class === 'Support') {
            attackBonus += 3;
            defenseBonus += 3;
          }
        }
      });
      
      return {
        ...slot,
        card: {
          ...slot.card,
          attackBonus: Math.max(0, attackBonus),
          defenseBonus: Math.max(0, defenseBonus),
          speedBonus: Math.max(0, speedBonus)
        }
      };
    });
  }, []);

  const battlefieldsWithBonuses = useMemo(() => {
    const flatWithBonuses = calculatePositioningBonuses(battlefields);
    return Array.from({ length: BATTLEFIELD_COUNT }, (_, battlefieldId) =>
      flatWithBonuses.slice(battlefieldId * POSITIONS_PER_BATTLEFIELD, (battlefieldId + 1) * POSITIONS_PER_BATTLEFIELD)
    );
  }, [battlefields, calculatePositioningBonuses]);

  // Event handlers using Zustand actions
  const addCardToForces = useCallback((template: typeof tacticalDeck[1] & { id: number }) => {
    const newCard = createCardFromTemplate(template);
    addCard(newCard);
  }, [createCardFromTemplate, addCard]);

  const handleCardSelect = useCallback((card: Card) => {
    if (!card.deployed) {
      selectCard(selectedCard?.instanceId === card.instanceId ? null : card);
    }
  }, [selectedCard, selectCard]);

  const handleGridSlotClick = useCallback((battlefieldId: number, position: number) => {
    const globalPos = battlefieldId * POSITIONS_PER_BATTLEFIELD + position;
    const cardAtPosition = globalPositionRecord[globalPos];
    
    // If there's a card at this position
    if (cardAtPosition) {
      if (engageMode) {
        // Engagement mode logic
        if (!engagingUnit) {
          // First unit selected - set as engaging unit
          setEngagingUnit(cardAtPosition);
          console.log('🎯 Engaging unit selected:', cardAtPosition.name);
        } else if (engagingUnit.instanceId !== cardAtPosition.instanceId) {
          // Second unit selected - set as target and execute engagement
          setTargetUnit(cardAtPosition);
          console.log('🎯 Target unit selected:', cardAtPosition.name);
          executeEngagement(engagingUnit, cardAtPosition);
        } else {
          // Same unit clicked - deselect
          setEngagingUnit(null);
        }
      } else {
        // Normal mode - select card for movement
        selectCard(cardAtPosition);
      }
      return;
    }
    
    // Empty slot clicked
    if (selectedCard && !engageMode) {
      // Movement logic - check if it's a valid move
      const selectedCardPosition = Object.keys(globalPositionRecord).find(
        pos => globalPositionRecord[parseInt(pos)]?.instanceId === selectedCard.instanceId
      );
      
      if (selectedCardPosition) {
        // Move the card
        handleMove(selectedCard, parseInt(selectedCardPosition), globalPos);
        return;
      }
    }
    
    // Original deployment logic for undeployed cards
    if (!selectedCard || selectedCard.deployed) return;
    
    if (!isPositionAvailable(globalPos)) {
      alert(`Position ${globalPos + 1} not available in ${gameState.currentSeason} season!`);
      return;
    }
    
    if (!isSupplyChainValid(battlefieldId, position)) {
      alert('Supply chain broken! Units must be adjacent to existing units.');
      return;
    }
    
    // Deploy card using Zustand action
    deployCard(selectedCard, globalPos);
    nextTurn();
  }, [
    selectedCard, 
    gameState.currentSeason, 
    isPositionAvailable, 
    isSupplyChainValid, 
    isPositionOccupied, 
    deployCard, 
    nextTurn,
    globalPositionRecord,
    engageMode,
    engagingUnit,
    setEngagingUnit,
    setTargetUnit,
    executeEngagement,
    selectCard,
    handleMove
  ]);

  const handleClearBoard = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const getTotalStats = (card: Card) => ({
    attack: card.attack + card.attackBonus,
    defense: card.defense + card.defenseBonus,
    speed: card.speed + card.speedBonus
  });

  const addMultipleCards = useCallback((count: number) => {
    tacticalDeckArray.slice(0, count).forEach(template => addCardToForces(template));
  }, [tacticalDeckArray, addCardToForces]);

  return (
<div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50">
 <div className="absolute inset-0 opacity-10">
   <div className="h-full w-full" 
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)`
        }} />
 </div>
 
 <div className="relative z-10 max-w-full mx-auto p-4 min-h-screen">
   {/* Main Game Layout */}
   <div className="grid grid-cols-12 gap-4 min-h-screen">
     {/* Left Panel - Army */}
     <div className="col-span-12 lg:col-span-2 flex flex-col gap-4">
       {/* Army Controls */}
       <div className="bg-gradient-to-r from-amber-900/90 via-amber-700/90 to-amber-900/90 
                       border border-amber-600 rounded-lg p-2 shadow-lg backdrop-blur-sm">
         {/* Season Info */}
         <div className={`px-3 py-1 rounded-lg bg-amber-800/80 border border-amber-600 font-semibold text-white text-sm
                         shadow-lg backdrop-blur-sm ${SEASON_COLORS[gameState.currentSeason]} mb-2`}>
           Turn {gameState.currentTurn} - {SEASON_LABELS[gameState.currentSeason]}
           <div className="text-xs opacity-80">
             {getTurnsLeftInSeason(gameState.currentTurn)} turns left
           </div>
         </div>
         
         {/* Game Stats */}
         <div className="flex flex-col gap-2 text-sm">
           <div className={`px-2 py-1 rounded-lg font-semibold backdrop-blur-sm border
                           ${gameState.currentPlayer === 1 
                             ? 'bg-amber-700/80 border-amber-500 text-amber-100' 
                             : 'bg-amber-800/80 border-amber-600 text-amber-100'
                           }`}>
             Player {gameState.currentPlayer}
           </div>
           
           {engageMode && (
             <div className="bg-red-700/90 border border-red-400 px-2 py-1 rounded-lg
                             font-semibold text-red-100 backdrop-blur-sm animate-pulse text-sm">
               ⚔️ COMBAT
               {engagingUnit && (
                 <div className="text-xs opacity-80">
                   {engagingUnit.name}
                 </div>
               )}
             </div>
           )}
           
           <div className="bg-amber-700/60 border border-amber-500 px-2 py-1 rounded-lg
                           font-medium text-amber-100 backdrop-blur-sm text-sm">
             {availablePositions.length}/{TOTAL_POSITIONS}
           </div>
           
           <div className="bg-amber-900/60 border border-amber-600 px-2 py-1 rounded-lg
                           font-medium text-amber-200 text-sm">
             Round {gameState.currentRound}
           </div>
         </div>
         
         {/* Action Buttons */}
         <div className="flex flex-col gap-1 mt-2">
           <button
             onClick={toggleEngageMode}
             className={`px-3 py-1 rounded-lg font-medium text-sm border transition-all duration-200
                       hover:scale-105 hover:shadow-md
                       ${engageMode 
                         ? 'bg-red-700/80 border-red-500 text-red-100 hover:bg-red-600/80' 
                         : 'bg-amber-800/80 border-amber-600 text-amber-100 hover:bg-amber-700/80'
                       }`}>
             {engageMode ? '⚔️ Combat' : '🛡️ Combat'}
           </button>
           
           <button
             onClick={nextTurn}
             className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                       font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                       hover:scale-105 transition-all duration-200">
             Skip Turn
           </button>
           
           <button
             onClick={() => updateGameState({ phase: 'waiting' })}
             disabled={gameState.deployedCount === 0}
             className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                       font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                       hover:scale-105 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
             Ready Battle
           </button>
           
           <button
             onClick={handleClearBoard}
             className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                       font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                       hover:scale-105 transition-all duration-200">
             Reset Game
           </button>
         </div>
       </div>

       {/* Army Forces */}
       <div className="flex-1 bg-gradient-to-b from-amber-900/80 to-amber-800/80 
                       border-1 border-amber-600 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
         <div className="flex justify-between items-center mb-3">
           <h2 className="text-lg font-semibold text-amber-300">🐎 Army</h2>
           <div className="text-amber-100 text-sm">{forces.length}</div>
         </div>
<div className="space-y-2 max-h-80 overflow-y-auto
                scrollbar-thin scrollbar-track-amber-100 scrollbar-thumb-amber-400 
                hover:scrollbar-thumb-amber-500 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
  {forces.map((card) => (
    <div
      key={card.instanceId}
      onClick={() => handleCardSelect(card)}
      className={`bg-gradient-to-br from-amber-100 to-amber-200 
                 border-2 rounded-lg p-2 cursor-pointer transition-all duration-300
                 text-amber-900 shadow-lg
                 ${card.deployed 
                   ? 'opacity-50 cursor-not-allowed' 
                   : selectedCard?.instanceId === card.instanceId
                     ? 'border-orange-500 shadow-orange-500/50 shadow-xl scale-105'
                     : 'border-amber-700 hover:shadow-xl hover:border-amber-500'
                 }`}>
      <div className="text-center font-semibold text-xs mb-1 leading-tight">
        {card.name}
      </div>
      <div className="flex justify-between text-xs mb-1">
        <div className="flex items-center gap-1">
          <span>⚔️</span>
          <span>{card.attack}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🛡️</span>
          <span>{card.defense}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>👟</span>
          <span>{card.speed}</span>
        </div>
      </div>
      <div className="text-xs text-amber-700 italic font-medium mb-1 text-center">
        {CLASS_ICONS[card.class]} {card.class}
      </div>
    </div>
  ))}
</div>
       </div>
     </div>

     {/* Center Panel - Battlefield */}
     <div className="col-span-12 lg:col-span-8">
       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 ">
         {battlefieldsWithBonuses.map((battlefield, battlefieldId) => (
           <div key={battlefieldId} className="bg-gradient-to-br from-amber-800/30 to-amber-900/50 
                       relative overflow-hidden shadow-2xl backdrop-blur-sm"
                style={{
                  borderImage: 'repeating-linear-gradient(45deg, #92400e 0px, #92400e 8px, #d97706 8px, #d97706 16px) 4',
                  borderRadius: '12px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                }}>
             
             <div className="text-center">
               <h3 className="text-sm text-amber-300 bg-black/40 rounded-lg py-1 px-2"
                   style={{
                     borderImage: 'linear-gradient(45deg, #d97706, #f59e0b) 1'
                   }}>
                 Battlefield {battlefieldId * 9 + 1}-{(battlefieldId + 1) * 9}
               </h3>
             </div>
             
             <div className="grid grid-cols-3 gap-2 p-3">
               {battlefield.map((slot) => {
                 const totalStats = slot.card ? getTotalStats(slot.card) : null;
                 const hasBonus = slot.card && (slot.card.attackBonus !== 0 || slot.card.defenseBonus !== 0 || slot.card.speedBonus !== 0);
                 const isAvailable = isPositionAvailable(slot.globalPosition);
                 const isSupplyValid = selectedCard ? isSupplyChainValid(battlefieldId, slot.position) : true;
                 const canPlace = isAvailable && isSupplyValid && !slot.card;
                 
                 return (
                   <div
                     key={`${battlefieldId}-${slot.position}`}
                     onClick={() => handleGridSlotClick(battlefieldId, slot.position)}
                     className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg relative 
                                 transition-all duration-300 cursor-pointer
                                 flex items-center justify-center text-xs
                                 ${slot.card ? 'bg-cover bg-center bg-no-repeat' : ''}
                                 ${!isAvailable 
                                   ? 'border-gray-500 bg-gray-500/20 cursor-not-allowed opacity-50'
                                   : slot.card 
                                     ? hasBonus 
                                       ? 'border-green-400 bg-green-400/30 shadow-lg shadow-green-400/30' 
                                       : 'border-amber-400 bg-amber-400/30 shadow-lg'
                                     : canPlace && selectedCard
                                       ? 'border-amber-400 bg-amber-400/20 hover:bg-amber-400/30 hover:scale-105'
                                       : !isSupplyValid && selectedCard
                                         ? 'border-red-500 bg-red-500/20 cursor-not-allowed opacity-60'
                                         : 'border-dashed border-amber-600 bg-amber-600/10 hover:border-amber-400 hover:bg-amber-400/20'
                                 }`}
                     style={{
                       backgroundImage: slot.card ? `url('${getCardBackgroundImage(slot.card, 1)}')` : `url(/images/cards/gen.png)`
                     }}>
                     
                     {/* Position Number */}
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full 
                                     flex items-center justify-center text-xs font-bold
                                     ${isAvailable 
                                       ? 'bg-black/50 text-amber-400' 
                                       : 'bg-gray-600 text-gray-300'
                                     }`}>
                       {slot.globalPosition + 1}
                     </div>

                     {/* Position Label */}
                     <div className="absolute bottom-0 right-0 text-[8px] text-amber-400/60 font-medium">
                       {POSITION_LABELS[slot.position]}
                     </div>

                     {/* Deployed Card */}
                     {slot.card && totalStats && (
                       <div className="text-center leading-tight">
                         {/* <div className="text-lg mb-1">{CLASS_ICONS[slot.card.class]}</div> */}
                         <div className="text-xs font-medium text-amber-100 mb-1">
                           {slot.card.name.split(' ')[0]}
                         </div>
                         
                         {/* Stats Row */}
                         <div className="flex justify-between text-xs mb-1 gap-1">
                           <span className="bg-red-500/30 text-red-200 px-1 rounded">{slot.card.attack}</span>
                           <span className="bg-blue-500/30 text-blue-200 px-1 rounded">{slot.card.defense}</span>
                           <span className="bg-green-500/30 text-green-200 px-1 rounded">{slot.card.speed}</span>
                         </div>
                         
                         {hasBonus && (
                           <div className="text-xs text-green-300 font-bold">
                             +{slot.card.attackBonus + slot.card.defenseBonus + slot.card.speedBonus}
                           </div>
                         )}
                       </div>
                     )}

                     {/* Empty Slot Indicator */}
                     {!slot.card && selectedCard && (
                       <div className={`text-lg ${canPlace ? 'text-amber-400/70' : 'text-red-400/70'}`}>
                         {canPlace ? '+' : '✕'}
                       </div>
                     )}

                     {/* Supply Chain Warning */}
                     {!slot.card && selectedCard && !isSupplyValid && isAvailable && (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-red-400 text-sm">⛓️💥</div>
                       </div>
                     )}

                     {/* Bonus Indicator */}
                     {hasBonus && (
                       <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 
                                       rounded-full animate-pulse"></div>
                     )}

                     {/* Season Restriction Indicator */}
                     {!isAvailable && (
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-gray-400 text-xl">🚫</div>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>

             <div className="text-center text-xs text-amber-200 pb-3">
               Units: {battlefield.filter(slot => slot.card).length}/9
               {battlefield.some(slot => slot.card && (slot.card.attackBonus > 0 || slot.card.defenseBonus > 0 || slot.card.speedBonus > 0)) && (
                 <span className="text-green-300 ml-2">⚡ Active</span>
               )}
             </div>
           </div>
         ))}
       </div>
     </div>

     {/* Right Panel - Unit Pool */}
     <div className="col-span-12 lg:col-span-2 flex flex-col gap-4">
       {/* Unit Pool Controls */}
       <div className="bg-gradient-to-r from-amber-900/90 via-amber-700/90 to-amber-900/90 
                       border border-amber-600 rounded-lg p-2 shadow-lg backdrop-blur-sm">
         <button
           onClick={() => addMultipleCards(8)}
           className="w-full px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                     font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                     hover:scale-105 transition-all duration-200 mb-2">
           Quick Add +8
         </button>
         
         <div className="grid grid-cols-2 gap-1">
           <button
             onClick={() => addMultipleCards(5)}
             className="bg-amber-800/60 border border-amber-600 rounded text-xs py-1
                        hover:bg-amber-700/60 transition-colors duration-200
                        text-amber-100 font-medium">
             Add 5
           </button>
           <button
             onClick={() => addMultipleCards(10)}
             className="bg-amber-800/60 border border-amber-600 rounded text-xs py-1
                        hover:bg-amber-700/60 transition-colors duration-200
                        text-amber-100 font-medium">
             Add 10
           </button>
         </div>
       </div>

       {/* Unit Pool */}
       <div className="flex-1 bg-gradient-to-b from-amber-900/80 to-amber-800/80 
                       border-1 border-amber-600 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
         <div className="flex justify-between items-center mb-3">
           <h2 className="text-lg font-semibold text-amber-300">⚔️ Units</h2>
           <div className="text-amber-100 text-sm">{tacticalDeckArray.length}</div>
         </div>
         
         <div className="max-h-80 overflow-y-auto space-y-1
                scrollbar-thin scrollbar-track-amber-100 scrollbar-thumb-amber-400 
                hover:scrollbar-thumb-amber-500 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
          {tacticalDeckArray.map((template) => (
            <div
              key={template.id}
              onClick={() => addCardToForces(template)}
              className="bg-gradient-to-br from-amber-100/90 to-amber-200/90 
                        border rounded-lg p-2 cursor-pointer transition-all duration-300
                        text-amber-900 shadow-sm text-xs
                        border-amber-700/50 hover:shadow-md hover:border-amber-500 hover:scale-[1.02]">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold leading-tight flex-1 text-xs">
                  {template.name}
                </div>
                <div className="text-sm ml-1">
                  {CLASS_ICONS[template.class]}
                </div>
              </div>
              
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1">
                  <span>⚔️</span>
                  <span>{template.attack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🛡️</span>
                  <span>{template.defense}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👟</span>
                  <span>{template.speed}</span>
                </div>
              </div>
              
              <div className="text-xs text-amber-700 italic font-medium text-center">
                {template.class}
              </div>
            </div>
          ))}
        </div>
       </div>
     </div>
   </div>
 </div>
</div>
  );
};

export default BattleInterface;