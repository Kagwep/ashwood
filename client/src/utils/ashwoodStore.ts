import { create } from 'zustand';
import { type Army, type ArmyUnitPosition, type ArmyUnitUsed, type BattleField, type BattleFieldPosition, type BattleZone, type BattlefieldStats, type Unit } from '../dojogen/models.gen';
import { removeLeadingZeros } from './sanitizer';

// Helper functions
export function getAllUnitIds(
  armyPositions: Record<string, ArmyUnitPosition>, 
  commanderId: string,
  armyId: string,
): string[] {
  return Object.values(armyPositions)
    .filter(position => 
      position.commander_id === commanderId &&
      position.army_id.toString() === armyId.toString()
    )
    .map(position => position.unit_id.toString());
}

export function getUnitsByIds(units: Record<string, Unit>, unitIds: string[]): Record<string, Unit> {
  const result: Record<string, Unit> = {};
  
  unitIds.forEach(id => {
    if (units[id]) {
      result[id] = units[id];
    }
  });
  
  return result;
}

export function getDeployedUnits(
  armyPositions: Record<string, ArmyUnitPosition>,
  commanderId: string,
  armyId: string,
  battlefieldId: string
): string[] {
  return Object.values(armyPositions)
    .filter(position => 
      position.commander_id === commanderId &&
      position.army_id.toString() === armyId.toString() &&
      position.position_index.toString() !== "0" && position.battlefield_id.toString() == battlefieldId.toString()
    )
    .map(position => position.unit_id.toString());
}

export function getUsedUnits(
  armyUnitsUsed: Record<string, ArmyUnitUsed>,
  commanderId: string,
  armyId: string,
  battlefieldId: string
): string[] {
  return Object.values(armyUnitsUsed)
    .filter(used => 
      used.commander_id === commanderId &&
      used.army_id.toString() === armyId &&
      used.battlefield_id.toString() === battlefieldId
    )
    .map(used => used.unit_id.toString());
}

// Store types
type GameState = {
    // Core entities
    armies: Record<string, Army>;
    units: Record<string, Unit>;
    battleFields: Record<string, BattleField>;
    armyUnitPositions: Record<string, ArmyUnitPosition>;
    armyUnitsUsed: Record<string, ArmyUnitUsed>;
    battleFieldPositions: Record<string, BattleFieldPosition>;
    battleZones: Record<string, BattleZone>;
    battlefieldStats: Record<string, BattlefieldStats>;
    
    // Player-specific data
    playerArmies: Record<string, Army>;
    deployment: Record<string, Unit & { positionIndex: number, armyId: number }>;
    reserves: Record<string, Unit & { positionIndex: number, armyId: number }>;
    playerArmyUnits: Record<string, Unit & { positionIndex: number, armyId: number }>;
    specialUnits: Record<string, Unit & { positionIndex: number, armyId: number }>;
    eliteUnits: Record<string, Unit & { positionIndex: number, armyId: number }>;

    // Battle-specific data
    invaderBattleUnits: Record<string, Unit>;
    invaderBattleUnitsDeployed: Record<string, Unit>;
    invaderBattleUnitsNotDeployed: Record<string, Unit>;
    invaderBattleUnitsUsed: Record<string, Unit>;
    defenderBattleUnits: Record<string, Unit>;
    defenderBattleUnitsDeployed: Record<string, Unit>;
    defenderBattleUnitsNotDeployed: Record<string, Unit>;
    defenderBattleUnitsUsed: Record<string, Unit>;

    selectedUnit: (Unit & { positionIndex?: number, armyId?: number }) | null;
    selectedArmy: Army | null;
    setSelectedArmy: (army: Army | null) => void;
    clearSelectedArmy: () => void;
    isArmySelected: (armyId: string | number) => boolean;

    setSelectedUnit: (unit: (Unit & { positionIndex?: number, armyId?: number }) | null) => void;
    clearSelectedUnit: () => void;
    isUnitSelected: (unitId: string | number) => boolean;

    // Battle unit functions
    loadInvaderBattleUnits: (invaderId: string, battleId: string, armyId: string) => void;
    loadDefenderBattleUnits: (defenderId: string, battleId: string, armyId: string) => void;
    isInBattleUnitsUsed: (unitId: string, commanderId: string, armyId: string, battlefieldId: string) => boolean;
    
    // Setters for core entities
    setArmy: (army: Army) => void;
    setUnit: (unit: Unit) => void;
    setBattleField: (battleField: BattleField) => void;
    setArmyUnitPosition: (armyUnitPosition: ArmyUnitPosition) => void;
    setArmyUnitUsed: (armyUnitUsed: ArmyUnitUsed) => void;
    setBattleFieldPosition: (battleFieldPosition: BattleFieldPosition) => void;
    setBattleZone: (battleZone: BattleZone) => void;
    setBattlefieldStats: (battlefieldStats: BattlefieldStats) => void;
    
    // Player-specific setters
    setPlayerArmy: (army: Army) => void;
    setPlayerArmyUnits: (armyId: number, unit: Unit & { positionIndex: number, armyId: number }) => void;
    setDeploymentUnit: (positionIndex: number, unit: Unit & { positionIndex: number, armyId: number }) => void;
    setReserveUnit: (positionIndex: number, unit: Unit & { positionIndex: number, armyId: number }) => void;
    
    // Utility functions
    removeCommander: (commanderAddress: string) => void;
    loadPlayerUnits: (commanderAddress: string, armyId: number) => void;
    loadUsedUnits: (commanderAddress: string, armyId: number, battlefieldId: number) => void;
    isUnitUsed: (commanderAddress: string, unitId: number, battlefieldId: number, armyId: number) => boolean;
    clear: () => void;
};

// Create store
export const useGameStore = create<GameState>((set, get) => ({
    // Core entities
    armies: {},
    units: {},
    battleFields: {},
    armyUnitPositions: {},
    armyUnitsUsed: {},
    battleFieldPositions: {},
    battleZones: {},
    battlefieldStats: {},
    
    // Player-specific data
    playerArmies: {},
    deployment: {},
    reserves: {},
    playerArmyUnits: {},
    specialUnits: {},
    eliteUnits: {},

    // Battle-specific data
    invaderBattleUnits: {},
    invaderBattleUnitsDeployed: {},
    invaderBattleUnitsNotDeployed: {},
    invaderBattleUnitsUsed: {},
    defenderBattleUnits: {},
    defenderBattleUnitsDeployed: {},
    defenderBattleUnitsNotDeployed: {},
    defenderBattleUnitsUsed: {},

    selectedArmy: null,
    selectedUnit: null,
    
    setSelectedUnit: (unit) => set({ selectedUnit: unit }),
    
    clearSelectedUnit: () => set({ selectedUnit: null }),
    
    isUnitSelected: (unitId) => {
        const { selectedUnit } = get();
        return selectedUnit?.id.toString() === unitId.toString();
    },

    setSelectedArmy: (army) => set({ selectedArmy: army }),
    
    clearSelectedArmy: () => set({ selectedArmy: null }),
    
    isArmySelected: (armyId) => {
        const { selectedArmy } = get();
        return selectedArmy?.army_id.toString() === armyId.toString();
    },

    // Battle unit functions
    loadInvaderBattleUnits: (invaderId: string, battleId: string, armyId: string) => {
        const state = get();
        
        // Get all unit IDs for the invader
        const unitIds = getAllUnitIds(state.armyUnitPositions, invaderId, armyId);
        const allUnits = getUnitsByIds(state.units, unitIds);
        
        // Get deployed units (position_index !== 0)
        const deployedUnitIds = getDeployedUnits(state.armyUnitPositions, invaderId, armyId, battleId);
        const deployedUnits = getUnitsByIds(state.units, deployedUnitIds);
        
        // Get not deployed units (all units minus deployed units)
        const notDeployedUnits: Record<string, Unit> = {};
        Object.entries(allUnits).forEach(([id, unit]) => {
            if (!deployedUnits[id]) {
                notDeployedUnits[id] = unit;
            }
        });
        
        // Get used units
        const usedUnitIds = getUsedUnits(state.armyUnitsUsed, invaderId, armyId, battleId);
        const usedUnits = getUnitsByIds(state.units, usedUnitIds);
        
        set({
            invaderBattleUnits: allUnits,
            invaderBattleUnitsDeployed: deployedUnits,
            invaderBattleUnitsNotDeployed: notDeployedUnits,
            invaderBattleUnitsUsed: usedUnits
        });
    },

    loadDefenderBattleUnits: (defenderId: string, battleId: string, armyId: string) => {
        const state = get();
        
        // Get all unit IDs for the defender
        const unitIds = getAllUnitIds(state.armyUnitPositions, defenderId, armyId);
        const allUnits = getUnitsByIds(state.units, unitIds);
        
        // Get deployed units (position_index !== 0)
        const deployedUnitIds = getDeployedUnits(state.armyUnitPositions, defenderId, armyId, battleId);
        const deployedUnits = getUnitsByIds(state.units, deployedUnitIds);
        
        // Get not deployed units (all units minus deployed units)
        const notDeployedUnits: Record<string, Unit> = {};
        Object.entries(allUnits).forEach(([id, unit]) => {
            if (!deployedUnits[id]) {
                notDeployedUnits[id] = unit;
            }
        });
        
        // Get used units
        const usedUnitIds = getUsedUnits(state.armyUnitsUsed, defenderId, armyId, battleId);
        const usedUnits = getUnitsByIds(state.units, usedUnitIds);
        
        set({
            defenderBattleUnits: allUnits,
            defenderBattleUnitsDeployed: deployedUnits,
            defenderBattleUnitsNotDeployed: notDeployedUnits,
            defenderBattleUnitsUsed: usedUnits
        });
    },

    isInBattleUnitsUsed: (unitId: string, commanderId: string, armyId: string, battlefieldId: string) => {
        const state = get();
        return Object.values(state.armyUnitsUsed).some(used => 
            used.unit_id.toString() === unitId &&
            removeLeadingZeros(used.commander_id) === commanderId &&
            used.army_id.toString() === armyId &&
            used.battlefield_id.toString() === battlefieldId
        );
    },
    
    // Core entity setters
    setArmy: (army: Army) => set((state) => ({
        armies: {
            ...state.armies,
            [`${army.army_id}_${army.commander_id}`]: army 
        }
    })),
    
    setUnit: (unit: Unit) => set((state) => ({
        units: {
            ...state.units,
            [`${unit.id}`]: unit  
        }
    })),
    
    setBattleField: (battleField: BattleField) => set((state) => ({
        battleFields: {
            ...state.battleFields,
            [`${battleField.battlefield_id}`]: battleField  
        }
    })),
    
    setArmyUnitPosition: (armyUnitPosition: ArmyUnitPosition) => set((state) => ({
        armyUnitPositions: {
            ...state.armyUnitPositions,
            [`${armyUnitPosition.army_id}_${armyUnitPosition.unit_id}_${armyUnitPosition.commander_id}`]: armyUnitPosition
        }
    })),
    
    setArmyUnitUsed: (armyUnitUsed: ArmyUnitUsed) => set((state) => ({
        armyUnitsUsed: {
            ...state.armyUnitsUsed,
            [`${armyUnitUsed.army_id}_${armyUnitUsed.commander_id}_${armyUnitUsed.unit_id}_${armyUnitUsed.battlefield_id}`]: armyUnitUsed
        }
    })),
    
    setBattleFieldPosition: (battleFieldPosition: BattleFieldPosition) => set((state) => ({
        battleFieldPositions: {
            ...state.battleFieldPositions,
            [`${battleFieldPosition.battlefield_id}_${battleFieldPosition.position}`]: battleFieldPosition
        }
    })),
    
    setBattleZone: (battleZone: BattleZone) => set((state) => ({
        battleZones: {
            ...state.battleZones,
            [`${battleZone.battlefield_id}_${battleZone.zone_position_id}`]: battleZone
        }
    })),
    
    setBattlefieldStats: (battlefieldStats: BattlefieldStats) => set((state) => ({
        battlefieldStats: {
            ...state.battlefieldStats,
            [`${battlefieldStats.battlefield_id}`]: battlefieldStats
        }
    })),
    
    // Player-specific setters
    setPlayerArmy: (army: Army) => set((state) => ({
        playerArmies: {
            ...state.playerArmies,
            [`${army.army_id}_${army.commander_id}`]: army
        }
    })),
    
    setPlayerArmyUnits: (armyId: number, unit: Unit & { positionIndex: number, armyId: number }) => set((state) => ({
        playerArmyUnits: {
            ...state.playerArmyUnits,
            [`${armyId}_${unit.id}`]: unit
        }
    })),
    
    setDeploymentUnit: (positionIndex: number, unit: Unit & { positionIndex: number, armyId: number }) => set((state) => ({
        deployment: {
            ...state.deployment,
            [`${positionIndex}`]: unit
        }
    })),
    
    setReserveUnit: (positionIndex: number, unit: Unit & { positionIndex: number, armyId: number }) => set((state) => ({
        reserves: {
            ...state.reserves,
            [`${positionIndex}`]: unit
        }
    })),
    
    // Utility functions
    removeCommander: (commanderAddress: string) => set((state) => {
        const newArmies = { ...state.armies };
        // Remove all armies owned by this commander
        Object.keys(newArmies).forEach(key => {
            if (removeLeadingZeros(newArmies[key].commander_id) === commanderAddress) {
                delete newArmies[key];
            }
        });
        return { armies: newArmies };
    }),
    
    loadPlayerUnits: (commanderAddress: string, armyId: number) => {
        const state = get();
        
        // Step 1: Filter army unit positions to get only those for this commander and army
        const armyUnitPositionEntries = Object.entries(state.armyUnitPositions).filter(([key, position]) => 
            removeLeadingZeros(position.commander_id) === commanderAddress && position.army_id === armyId
        );
        
        // Step 2: Process the positions and categorize units
        const regularUnits: Record<string, Unit & { positionIndex: number, armyId: number }> = {};
        const specialUnitsTemp: Record<string, Unit & { positionIndex: number, armyId: number }> = {};
        const eliteUnitsTemp: Record<string, Unit & { positionIndex: number, armyId: number }> = {};
        
        armyUnitPositionEntries.forEach(([key, position]) => {
            // Find the unit for this position
            const unit = state.units[position.unit_id.toString()];
            
            if (unit) {
                const enhancedUnit = {
                    ...unit,
                    positionIndex: position.position_index as number,
                    armyId: position.army_id as number
                };
                
                const posIndex = position.position_index;
                
                // Categorize based on position index (assuming similar structure to touchline)
                if (posIndex === 12 || posIndex === 13) {
                    // Special units (positions 12-13)
                    specialUnitsTemp[posIndex.toString()] = enhancedUnit;
                } else if (posIndex === 14 || posIndex === 15) {
                    // Elite units (positions 14-15)
                    eliteUnitsTemp[posIndex.toString()] = enhancedUnit;
                } else {
                    // Regular army units
                    regularUnits[posIndex.toString()] = enhancedUnit;
                    if (posIndex as number <= 11) {
                        const newPositionIndex = posIndex as any - 1;
                        state.setDeploymentUnit(newPositionIndex, {
                            ...unit,
                            positionIndex: newPositionIndex,
                            armyId: position.army_id as number
                        });
                    }
                }
            }
        });
        
        // Update the state with all categorized units
        set({
            playerArmyUnits: regularUnits,
            specialUnits: specialUnitsTemp,
            eliteUnits: eliteUnitsTemp
        });
    },
    
    loadUsedUnits: (commanderAddress: string, armyId: number, battlefieldId: number) => {
        const state = get();
        
        // Filter used units for this commander, army, and battlefield
        const usedUnitEntries = Object.entries(state.armyUnitsUsed).filter(([key, usedUnit]) => 
            removeLeadingZeros(usedUnit.commander_id) === commanderAddress && 
            usedUnit.army_id.toString() === armyId.toString() &&
            usedUnit.battlefield_id.toString() === battlefieldId.toString()
        );
        
        // Return a list of used unit IDs if needed
        return usedUnitEntries.map(([key, usedUnit]) => usedUnit.unit_id);
    },
    
    isUnitUsed: (commanderAddress: string, unitId: number, battlefieldId: number, armyId: number) => {
        const state = get();
        const result = Object.values(state.armyUnitsUsed).some(usedUnit => {
            const isUsed = 
                usedUnit.unit_id.toString() === unitId.toString() &&
                usedUnit.battlefield_id.toString() === battlefieldId.toString() &&
                usedUnit.army_id.toString() === armyId.toString() &&
                removeLeadingZeros(usedUnit.commander_id).toString() === commanderAddress.toString();
            return isUsed;
        });
        console.log('Unit used check result:', result);
        return result;
    },
    
    clear: () => set(() => ({
        armies: {},
        units: {},
        battleFields: {},
        armyUnitPositions: {},
        armyUnitsUsed: {},
        battleFieldPositions: {},
        battleZones: {},
        battlefieldStats: {},
        playerArmies: {},
        deployment: {},
        reserves: {},
        playerArmyUnits: {},
        specialUnits: {},
        eliteUnits: {},
        // Clear battle-specific data too
        invaderBattleUnits: {},
        invaderBattleUnitsDeployed: {},
        invaderBattleUnitsNotDeployed: {},
        invaderBattleUnitsUsed: {},
        defenderBattleUnits: {},
        defenderBattleUnitsDeployed: {},
        defenderBattleUnitsNotDeployed: {},
        defenderBattleUnitsUsed: {}
    })),
}));