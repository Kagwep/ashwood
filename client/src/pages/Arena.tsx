import React, { useCallback, useMemo, useState } from 'react';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojo } from '../dojo/useDojo';
import { Account, CairoCustomEnum } from 'starknet';
import { toast } from 'react-toastify';
import { useAllEntities } from '../utils/ash';
import { useAshwoodStore } from '../utils/ashwood';
import { useGameStore } from '../utils/ashwoodStore';
import { removeLeadingZeros } from '../utils/sanitizer';
import type { BattleField, Unit } from '../dojogen/models.gen';
import { getSeason, parseStarknetError } from '../utils';
import { Info } from 'lucide-react';
import GameRulesModal from '../components/GameRulesModal';

// Types
interface GridPosition {
  battlefieldId: number;
  position: number;
  globalPosition: number;
  unit: Unit | null;
  unitOwner?: 'invader' | 'defender' | null;
}

// Constants
const BATTLEFIELD_COUNT = 6;
const POSITIONS_PER_BATTLEFIELD = 9;
const TOTAL_POSITIONS = BATTLEFIELD_COUNT * POSITIONS_PER_BATTLEFIELD;

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

// Game state for UI
interface GameUIState {
  currentTurn: number;
  currentPlayer: 1 | 2;
  currentSeason: 'odd' | 'even' | 'prime';
  currentRound: number;
  phase: 'deployment' | 'battle' | 'waiting';
  engageMode: boolean;
}

// Season display constants
const TURNS_PER_SEASON = 8;
const SEASON_COLORS = {
  odd: 'bg-red-900/90 border-yellow-700',
  even: 'bg-emerald-800/90 border-amber-600',
  prime: 'bg-indigo-900/90 border-silver-500'
};

const SEASON_LABELS = {
  odd: '🔵 Odd Season',
  even: '🟢 Even Season',
  prime: '🟣 Prime Season'
};

const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];

const BattleInterface: React.FC = () => {
  // Dojo and account
  const {
    setup: { client },
  } = useDojo();
  
  const { account, address } = useNetworkAccount();
  
  // Stores
  const { battle_id, army_id } = useAshwoodStore();
  const { state, refetch } = useAllEntities();
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // Game store data
  const {
    selectedUnit,
    setSelectedUnit,
    clearSelectedUnit,
    isUnitSelected,
    invaderBattleUnitsNotDeployed,
    defenderBattleUnitsNotDeployed,
    invaderBattleUnitsDeployed,
    defenderBattleUnitsDeployed,
    battleFieldPositions,
    battleFields,
    armyUnitsUsed
  } = useGameStore();

  const units = state.units;

  // Local UI state
  const [gameUIState, setGameUIState] = useState<GameUIState>({
    currentTurn: 1,
    currentPlayer: 1,
    currentSeason: 'odd',
    currentRound: 1,
    phase: 'deployment',
    engageMode: false
  });

  const [engagingUnit, setEngagingUnit] = useState<Unit | null>(null);
  const [targetUnit, setTargetUnit] = useState<Unit | null>(null);

  console.log(defenderBattleUnitsDeployed)
  console.log(invaderBattleUnitsDeployed)


  // Get current battlefield
  const selectedBattleField = battleFields[battle_id.toString()];
  
  // Determine user role
  const isUserInvader = account.address === removeLeadingZeros(selectedBattleField?.invader_commander_id || '');
  const isUserDefender = account.address === removeLeadingZeros(selectedBattleField?.defender_commander_id || '');
  
  // Utility functions
  const getTurnsLeftInSeason = (turn: number): number => {
    return TURNS_PER_SEASON - ((turn - 1) % TURNS_PER_SEASON);
  };

  const getAvailablePositions = (season: any): number[] => {
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

  // Add this helper function in your component before the return statement
const getSlotStyling = (slot, canPlace) => {
  if (slot.unit) {
    return slot.unitOwner === 'invader'
      ? 'border-red-400 bg-red-400/30 shadow-lg'
      : 'border-blue-400 bg-blue-400/30 shadow-lg';
  }
  
  if (canPlace) {
    return 'border-amber-400 bg-amber-400/20 hover:bg-amber-400/30 hover:scale-105';
  }
  
  // Season-based highlighting for empty slots - maintaining amber theme with subtle variations
  const currentSeason = getSeason(selectedBattleField.season as number).toLowerCase();
  const isAvailableInSeason = availablePositions.includes(slot.globalPosition);
  
  if (isAvailableInSeason) {
    switch (currentSeason) {
      case 'prime':
        return 'border-dashed border-amber-300 bg-amber-300/25 hover:border-amber-200 hover:bg-amber-300/35 shadow-amber-400/30 ring-2 ring-amber-300/60';
      case 'odd':
        return 'border-dashed border-amber-500 bg-amber-500/20 hover:border-amber-400 hover:bg-amber-500/30 shadow-amber-600/25 ring-1 ring-amber-500/50';
      case 'even':
        return 'border-dashed border-amber-600 bg-amber-600/15 hover:border-amber-500 hover:bg-amber-600/25 shadow-amber-700/20 ring-1 ring-amber-600/40';
      default:
        return 'border-dashed border-amber-600 bg-amber-600/10 hover:border-amber-400 hover:bg-amber-400/20';
    }
  } else {
    // Grayed out for positions not available in current season
    return 'border-dashed border-amber-800 bg-amber-900/10 opacity-30 cursor-not-allowed';
  }
};

  const getCardBackgroundImage = (unit: Unit, playerId: number) => {
    if (!unit) return '';
    const className = unit.unit_class.toString().toLowerCase();
    return `/images/cards/${className}${playerId}.png`;
  };

  // Get appropriate units based on user role
  const userUnitsNotDeployed = isUserInvader ? invaderBattleUnitsNotDeployed : defenderBattleUnitsNotDeployed;
  const userUnitsDeployed = isUserInvader ? invaderBattleUnitsDeployed : defenderBattleUnitsDeployed;

  console.log(userUnitsDeployed)
  
  // Get ALL deployed units from both sides for battlefield display
  const allDeployedUnits = {
    ...invaderBattleUnitsDeployed,
    ...defenderBattleUnitsDeployed
  };

  // Calculate available positions for current season
  const availablePositions = getAvailablePositions(getSeason(selectedBattleField.season as number).toLowerCase());

      // Create battlefield grid from battle field positions
    // 🔧 FIXED: Battlefield grid with correct ownership logic
const battlefields = useMemo((): GridPosition[][] => {
  return Array.from({ length: BATTLEFIELD_COUNT }, (_, battlefieldId) =>
    Array.from({ length: POSITIONS_PER_BATTLEFIELD }, (_, position) => {
      const globalPosition = battlefieldId * POSITIONS_PER_BATTLEFIELD + position + 1;
      
      // Find unit at this position from battleFieldPositions
      const unitAtPosition = Object.values(battleFieldPositions).find(
        pos => pos.battlefield_id.toString() === battle_id.toString() && 
               pos.position.toString() === globalPosition.toString()
      );
      
      let unit: Unit | null = null;
      let unitOwner: 'invader' | 'defender' | null = null;
      
      if (unitAtPosition && unitAtPosition.unit_id && unitAtPosition.is_occupied) {
        // 🔧 STEP 1: Determine ownership FIRST using the owner field
        const ownerAddress = removeLeadingZeros(unitAtPosition.owner);
        const invaderAddress = removeLeadingZeros(selectedBattleField?.invader_commander_id || '');
        const defenderAddress = removeLeadingZeros(selectedBattleField?.defender_commander_id || '');
        
        if (ownerAddress === invaderAddress) {
          unitOwner = 'invader';
        } else if (ownerAddress === defenderAddress) {
          unitOwner = 'defender';
        }
        
        // 🔧 STEP 2: Check if unit is eliminated before showing it
        const unitId = unitAtPosition.unit_id.toString();
        const armyId = unitAtPosition.army_id.toString();
        
        // Check if unit is eliminated/used
        const isUnitEliminated = Object.values(armyUnitsUsed).some(usedUnit => 
          usedUnit.unit_id.toString() === unitId &&
          usedUnit.battlefield_id.toString() === battle_id.toString() &&
          usedUnit.army_id.toString() === armyId &&
          removeLeadingZeros(usedUnit.commander_id) === ownerAddress &&
          usedUnit.turn.toString() !== "0" // turn != 0 means eliminated
        );
        
        // 🔧 STEP 3: Only show unit if it's NOT eliminated
        if (!isUnitEliminated) {
          if (unitOwner === 'invader') {
            unit = invaderBattleUnitsDeployed[unitId] || units[unitId];
          } else if (unitOwner === 'defender') {
            unit = defenderBattleUnitsDeployed[unitId] || units[unitId];
          }
          
          // Debug logging
          if (unit) {
            console.log(`Position ${globalPosition}: Unit ${unit.id} (${unit.player_name}) owned by ${unitOwner}`);
          } else {
            console.warn(`Unit ${unitId} not found for ${unitOwner} at position ${globalPosition}`);
          }
        } else {
          console.log(`Position ${globalPosition}: Unit ${unitId} eliminated - position is now free`);
        }
      }
      
      return {
        battlefieldId,
        position,
        globalPosition,
        unit,
        unitOwner
      };
    })
  );
}, [battleFieldPositions, battle_id, invaderBattleUnitsDeployed, defenderBattleUnitsDeployed, units, selectedBattleField, armyUnitsUsed]);


  // Smart contract interaction functions
  const handleDeployUnit = useCallback(async (unit: Unit, globalPosition: number, battle: BattleField) => {
    const isUsersTurn = isUserDefender && (battle.current_turn as number) % 2 === 0 || isUserInvader && (battle.current_turn as number) % 2 === 1;
    if(!isUsersTurn){
      toast.error("Its not Your turn");
      // console.log(selectedBattleField.current_turn)
      return;
    }
    try {
      console.log('Deploying unit:', unit.id, 'to position:', globalPosition);
      const newPos = globalPosition +1;
      let result = await (await client).battlefields.deployUnitToBattlefield(
                account as Account,
                battle_id,
                army_id,
                unit.id,
                globalPosition
              );
        
      if (result && result.transaction_hash) {
        toast.success(`Unit ${unit.player_name} deployed to position ${globalPosition + 1}`);
      }
    } catch (error) {
      const errorParsed = parseStarknetError(error);
      
      console.log(errorParsed)

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error('Deployment failed');
      }

    }
  }, [client, battle_id, army_id]);

  const handleMoveUnit = useCallback(async (unit: Unit, fromPosition: number, toPosition: number) => {

    try {
;
      let result = await (await client).actions.moveUnit(
                account as Account,
                battle_id,
                army_id,
                unit.id,
                fromPosition,
                toPosition
              );
        
      if (result && result.transaction_hash) {
        //console.log(result,result.transaction_hash);
        toast.success(`Unit ${unit.player_name} moved to position ${toPosition + 1}`);
      }
      
    } catch (error) {
      const errorParsed = parseStarknetError(error);
      
      console.log(errorParsed)

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error('Move failed');
      }
      
    }
  }, [client, battle_id]);

  const handleCombatAction = useCallback(async (attackingUnit: Unit, targetUnit: Unit) => {
    try {
      console.log('Combat:', attackingUnit.id, 'attacking:', targetUnit.id);
            let result = await (await client).actions.attackUnit(
                account as Account,
                battle_id,
                attackingUnit.id,
                targetUnit.id
              );
        
      if (result && result.transaction_hash) {
      toast.success(`${attackingUnit.player_name} attacks ${targetUnit.player_name}`);
    }
    } catch (error) {
            const errorParsed = parseStarknetError(error);
      
      console.log(errorParsed)

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error('Combat failed');
      }
      
    }
  }, [client, battle_id]);

  // Event handlers
  const handleUnitSelect = useCallback((unit: Unit) => {
    if (isUnitSelected(unit.id.toString())) {
      clearSelectedUnit();
    } else {
      setSelectedUnit(unit);
    }
  }, [setSelectedUnit, clearSelectedUnit, isUnitSelected]);

  const handleGridSlotClick = useCallback((battlefieldId: number, position: number, battle: BattleField) => {
    const globalPos = battlefieldId * POSITIONS_PER_BATTLEFIELD + position + 1;
    const slot = battlefields[battlefieldId][position];
    const unitAtPosition = slot.unit;
    
    // If there's a unit at this position
    if (unitAtPosition) {
      if (gameUIState.engageMode) {
        // Engagement mode logic
        if (!engagingUnit) {
          setEngagingUnit(unitAtPosition);
          console.log('🎯 Engaging unit selected:', unitAtPosition.player_name);
        } else if (engagingUnit.id !== unitAtPosition.id) {
          setTargetUnit(unitAtPosition);
          console.log('🎯 Target unit selected:', unitAtPosition.player_name);
          // Execute combat
          handleCombatAction(engagingUnit, unitAtPosition);
          setEngagingUnit(null);
          setTargetUnit(null);
        } else {
          // Same unit clicked - deselect
          setEngagingUnit(null);
        }
      } else {
        // Normal mode - select unit for movement
        handleUnitSelect(unitAtPosition);
      }
      return;
    }
    
    // Empty slot clicked
    if (selectedUnit && !gameUIState.engageMode) {
      // Check if it's a move (unit is already deployed) or deployment (unit is not deployed)
      const isDeployedUnit = Object.values(userUnitsDeployed).some(u => u.id === selectedUnit.id);
      
      if (isDeployedUnit) {
        // Find current position of the unit
        const currentPosition = Object.values(battleFieldPositions).find(
          pos => pos.unit_id.toString() === selectedUnit.id.toString() && 
                 pos.battlefield_id.toString() === battle_id.toString()
        );
        
        if (currentPosition) {
          // Move unit
          console.log("global",globalPos,currentPosition.position.toString())
          handleMoveUnit(selectedUnit, parseInt(currentPosition.position.toString()), globalPos);
        }
      } else {
        // Deploy unit
        handleDeployUnit(selectedUnit, globalPos,battle);
      }
      
      clearSelectedUnit();
      return;
    }
  }, [
    battlefields,
    gameUIState.engageMode,
    engagingUnit,
    selectedUnit,
    handleUnitSelect,
    handleCombatAction,
    handleMoveUnit,
    handleDeployUnit,
    clearSelectedUnit,
    userUnitsDeployed,
    battleFieldPositions,
    battle_id
  ]);

  const toggleEngageMode = useCallback(() => {
    setGameUIState(prev => ({ ...prev, engageMode: !prev.engageMode }));
    setEngagingUnit(null);
    setTargetUnit(null);
    clearSelectedUnit();
  }, [clearSelectedUnit]);

  const nextTurn = useCallback(() => {
    setGameUIState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn + 1,
      currentPlayer: prev.currentPlayer === 1 ? 2 : 1
    }));
    clearSelectedUnit();
  }, [clearSelectedUnit]);

  const isPositionValid = useCallback((globalPosition: number): boolean => {
    // Check if position is available in current season
    const isSeasonValid = availablePositions.includes(globalPosition );
    
    // Check deployment zone restrictions based on player role
    let isZoneValid = false;
    if (isUserInvader) {
      // Invader can deploy in positions 1-27 (first 3 battlefields)
      isZoneValid = globalPosition  <= 27;
    } else if (isUserDefender) {
      // Defender can deploy in positions 28-54 (last 3 battlefields)
      isZoneValid = globalPosition >= 28;
    }
    
    return isSeasonValid && isZoneValid;
  }, [availablePositions, isUserInvader, isUserDefender]);

    // 6. Update getAdjacentPositions to work with 1-based positions:
    const getAdjacentPositions = useCallback((globalPos: number): number[] => {
      // Convert to 0-based for calculation
      const zeroBasedPos = globalPos - 1;
      const battlefieldId = Math.floor(zeroBasedPos / POSITIONS_PER_BATTLEFIELD);
      const localPos = zeroBasedPos % POSITIONS_PER_BATTLEFIELD;
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
            const newGlobalPos = battlefieldId * POSITIONS_PER_BATTLEFIELD + newLocalPos + 1; // ← Convert back to 1-based
            adjacent.push(newGlobalPos);
          }
        }
      }
      
      return adjacent;
    }, []);

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
            <div className="flex-1 bg-gradient-to-b from-amber-900/80 to-amber-800/80 
                            border-1 border-amber-600 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-amber-300">🐎 Army</h2>
                <div className="text-amber-100 text-sm">{Object.keys(userUnitsNotDeployed).length}</div>
              </div>

              {/* Game Stats */}
              <div className="flex flex-col gap-2 text-sm mb-2">
                <div className={`px-2 py-1 rounded-lg font-semibold backdrop-blur-sm border
                                ${gameUIState.currentPlayer === 1 
                                  ? 'bg-amber-700/80 border-amber-500 text-amber-100' 
                                  : 'bg-amber-800/80 border-amber-600 text-amber-100'
                                }`}>  
                <div className='bg-amber-200 p-1 rounded'>
                  🏹 <span className=" text-sm text-red-600">{ isUserInvader && (selectedBattleField.current_turn as number) % 2 == 1 || isUserDefender && (selectedBattleField.current_turn as number) % 2 == 0?  'Your Turn': 'Opponets Turn'}</span>
                </div>
                </div>
                
                <div className="bg-amber-700/60 border border-amber-500 px-2 py-1 rounded-lg
                                font-medium text-amber-100 backdrop-blur-sm text-sm">
                  {availablePositions.length}/{TOTAL_POSITIONS} positions
                </div>
                
                <div className="bg-amber-900/60 border border-amber-600 px-2 py-1 rounded-lg
                                font-medium text-amber-200 text-sm">
                  Round {gameUIState.currentRound}
                </div>
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto
                              scrollbar-thin scrollbar-track-amber-100 scrollbar-thumb-amber-400 
                              hover:scrollbar-thumb-amber-500 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
                {Object.values(userUnitsNotDeployed).map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => handleUnitSelect(unit)}
                    className={`bg-gradient-to-br from-amber-100 to-amber-200 
                     border-2 rounded-lg p-2 cursor-pointer transition-all duration-300
                     text-amber-900 shadow-lg
                     ${selectedUnit?.id === unit.id
                       ? 'border-orange-500 shadow-orange-500/50 shadow-xl scale-105'
                       : 'border-amber-700 hover:shadow-xl hover:border-amber-500'
                     }`}>
                    
                    <div className="text-center font-semibold text-xs mb-1 leading-tight">
                      {unit.player_name || `Unit #${unit.id}`}
                    </div>
                    
                    <div className="flex justify-between text-xs mb-1">
                      <div className="flex items-center gap-1">
                        <span>⚔️</span>
                        <span>{unit.attack}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🛡️</span>
                        <span>{unit.defense}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👟</span>
                        <span>{unit.speed}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs mb-1">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{unit.special}</span>
                      </div>
                      <div className="text-xs text-amber-700 italic font-medium">
                        {CLASS_ICONS[unit.unit_class as unknown as keyof typeof CLASS_ICONS] || '⚔️'} {unit.unit_class as unknown as string}
                      </div>
                    </div>
                    
                    <div className="text-xs text-center font-bold">
                      {isUserInvader ? (
                        <span className="text-red-600">⚔️ INVADER</span>
                      ) : (
                        <span className="text-blue-600">🛡️ DEFENDER</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Battlefield */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {battlefields.map((battlefield, battlefieldId) => (
                <div key={battlefieldId} className="bg-gradient-to-br from-amber-800/30 to-amber-900/50 
                            relative overflow-hidden shadow-2xl backdrop-blur-sm"
                     style={{
                       borderImage: 'repeating-linear-gradient(45deg, #92400e 0px, #92400e 8px, #d97706 8px, #d97706 16px) 4',
                       borderRadius: '12px',
                       boxShadow: '0 0 20px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                     }}>
                  
                  <div className="text-center">
                    <h3 className="text-sm text-amber-300 bg-black/40 rounded-lg py-1 px-2">
                      Battlefield {battlefieldId * 9 + 1}-{(battlefieldId + 1) * 9}
                      {/* Show zone indicator */}
                      {battlefieldId < 3 ? (
                        <span className="text-red-400 ml-2">⚔️ INVADER ZONE</span>
                      ) : (
                        <span className="text-blue-400 ml-2">🛡️ DEFENDER ZONE</span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {battlefield.map((slot) => {
                      const isPositionValidForPlacement = isPositionValid(slot.globalPosition);
                      const canPlace = isPositionValidForPlacement && !slot.unit && selectedUnit;
                      
                      return (
                        <div
                          key={`${battlefieldId}-${slot.position}`}
                          onClick={() => handleGridSlotClick(battlefieldId, slot.position,selectedBattleField)}
                          className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg relative 
                                      transition-all duration-300 cursor-pointer
                                      flex items-center justify-center text-xs overflow-hidden
                                      ${getSlotStyling(slot, canPlace)}`}
                                  style={{
                                  backgroundImage: slot.unit 
                                      ? `url('${getCardBackgroundImage(slot.unit, slot.unitOwner === 'invader' ? 1 : 2)}')`
                                      : `url(/images/cards/gen.png)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                  }}>
                          
                          {/* Position Number */}
                          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full 
                                          flex items-center justify-center text-xs font-bold
                                          ${isPositionValidForPlacement 
                                            ? 'bg-black/50 text-amber-400' 
                                            : 'bg-gray-600 text-gray-300'
                                          }`}>
                            {slot.globalPosition}
                          </div>

                          {/* Position Label */}
                          <div className="absolute bottom-0 right-0 text-[8px] text-amber-400/60 font-medium">
                            {POSITION_LABELS[slot.position]}
                          </div>

                          {/* Season Restriction Indicator */}
                          {!isPositionValidForPlacement && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-gray-400 text-xs"></div>
                            </div>
                          )}

                          {/* Deployed Unit */}
                          {slot.unit && (
                            <div className="text-center leading-tight">
                              <div className="text-xs font-medium text-amber-100 mb-1">
                                {slot.unit.player_name?.toString().split(' ')[0] || `Unit ${slot.unit.id}`}
                              </div>
                              
 
                              
                              {/* Unit Owner Indicator */}
                              <div className="text-[8px] font-bold">
                                {slot.unitOwner === 'invader' ? (
                                  <span className="text-red-300">⚔️ INV</span>
                                ) : (
                                  <span className="text-blue-300">🛡️ DEF</span>
                                )}
                              </div>

                            <div className="flex justify-between text-xs gap-0.5">
                                <span className="bg-red-500 text-red-200 px-1 rounded">{slot.unit.attack}</span>
                                <span className="bg-blue-500 text-blue-200 px-1 rounded">{slot.unit.defense}</span>
                                <span className="bg-green-500 text-green-200 px-1 rounded">{slot.unit.speed}</span>
                              </div>
                            </div>
                          )}

                          {/* Empty Slot Indicator */}
                          {!slot.unit && selectedUnit && (
                            <div className={`text-lg ${canPlace ? 'text-amber-400/70' : 'text-red-400/70'}`}>
                              {canPlace ? '+' : '✕'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-center text-xs text-amber-200 pb-3">
                    Units: {battlefield.filter(slot => slot.unit).length}/9
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="col-span-12 lg:col-span-2 flex flex-col gap-4">
            <div className="bg-gradient-to-r from-amber-900/90 via-amber-700/90 to-amber-900/90 
                            border border-amber-600 rounded-lg p-2 shadow-lg backdrop-blur-sm">
              
              {/* Season Info */}
              <div className={`px-3 py-1 rounded-lg bg-amber-800/80 border border-amber-600 font-semibold text-white text-sm
                              shadow-lg backdrop-blur-sm ${SEASON_COLORS[gameUIState.currentSeason]} mb-2`}>
                Turn {selectedBattleField.current_turn} - {SEASON_LABELS[getSeason(selectedBattleField.season as number).toLowerCase()]}
                <div className="text-xs opacity-80">
                  {getTurnsLeftInSeason(selectedBattleField.season as number)} turns left for season
                </div>
              </div>
              
              {/* Combat Mode Indicator */}
              {gameUIState.engageMode && (
                <div className="bg-red-700/90 border border-red-400 px-2 py-1 rounded-lg
                                font-semibold text-red-100 backdrop-blur-sm animate-pulse text-sm mb-2">
                  ⚔️ COMBAT MODE
                  {engagingUnit && (
                    <div className="text-xs opacity-80">
                      {engagingUnit.player_name}
                    </div>
                  )}
                </div>
              )}
              
              {/* Selected Unit Info */}
              {selectedUnit && (
                <div className="bg-amber-700/60 border border-amber-500 px-2 py-1 rounded-lg
                                font-medium text-amber-100 backdrop-blur-sm text-sm mb-2">
                  Selected: {selectedUnit.player_name || `Unit ${selectedUnit.id}`}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={toggleEngageMode}
                  className={`px-3 py-1 rounded-lg font-medium text-sm border transition-all duration-200
                            hover:scale-105 hover:shadow-md
                            ${gameUIState.engageMode 
                              ? 'bg-red-700/80 border-red-500 text-red-100 hover:bg-red-600/80' 
                              : 'bg-amber-800/80 border-amber-600 text-amber-100 hover:bg-amber-700/80'
                            }`}>
                  {gameUIState.engageMode ? '⚔️ Exit Combat' : '🗡️ Enter Combat'}
                </button>
                
                <button
                  onClick={nextTurn}
                  className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                            font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                            hover:scale-105 transition-all duration-200">
                  End Turn
                </button>
                
                <button
                  onClick={() => setGameUIState(prev => ({ ...prev, phase: 'waiting' }))}
                  className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                            font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                            hover:scale-105 transition-all duration-200">
                  Ready Battle
                </button>
                <div className='px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg '>
                  Score
                  { isUserInvader && (
                    <div className='px-3 py-1 bg-amber-500/80 border border-amber-600 rounded-lg'>
                    <span>{ `You:`} <span className='p-1 text-green-600'>{selectedBattleField.invader_score}</span></span>
                    <span> {` Opp:`}  <span className='p-1 text-red-600'>{selectedBattleField.defender_score}</span></span>
                  </div>
                  )}
                  { isUserDefender && (
                    <div className='px-3 py-1 bg-amber-500/80 border border-amber-600 rounded-lg'>
                    <span> {` You: `}  <span className='p-1 text-green-600'>{selectedBattleField.defender_score}</span></span>
                     <span>{ `Opp: `} <span className='p-1 text-red-600'>{selectedBattleField.invader_score}</span></span>
                  </div>
                  )}
                </div>
                <button
                onClick={() => setShowRulesModal(true)}
                className="px-3 py-1 bg-amber-800/80 border border-amber-600 rounded-lg 
                          font-medium text-amber-100 text-sm hover:bg-amber-700/80 
                          hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Game Rules
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GameRulesModal 
        isOpen={showRulesModal} 
        onClose={() => setShowRulesModal(false)} 
      />
    </div>
  );
};

export default BattleInterface;