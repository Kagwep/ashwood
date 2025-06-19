import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types (same as your existing ones)
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

interface GameState {
  phase: 'deployment' | 'waiting' | 'reveal' | 'combat' | 'finished';
  currentRound: number;
  currentTurn: number;
  currentSeason: 'odd' | 'even' | 'prime';
  deployedCount: number;
  maxDeployment: number;
  currentPlayer: 1 | 2;
}

// Global Position Record
type GlobalPositionRecord = Record<number, Card | null>;

// Store Interface
interface BattleStore {
  // State
  forces: Card[];
  selectedCard: Card | null;
  gameState: GameState;
  globalPositionRecord: GlobalPositionRecord;
  
  // Engagement system
  engageMode: boolean;
  engagingUnit: Card | null;
  targetUnit: Card | null;
  
  // Actions
  addCard: (card: Card) => void;
  removeCard: (instanceId: string) => void;
  selectCard: (card: Card | null) => void;
  deployCard: (card: Card, globalPosition: number) => void;
  removeCardFromPosition: (globalPosition: number) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  nextTurn: () => void;
  resetGame: () => void;
  
  // Engagement actions
  toggleEngageMode: () => void;
  setEngagingUnit: (card: Card | null) => void;
  setTargetUnit: (card: Card | null) => void;
  executeEngagement: (attacker: Card, target: Card) => void;
  handleMove: (card: Card, fromPosition: number, toPosition: number) => void;
  
  // Computed/Helper methods
  getCardAtPosition: (globalPosition: number) => Card | null;
  isPositionOccupied: (globalPosition: number) => boolean;
  getAvailableForces: () => Card[];
  getDeployedForces: () => Card[];
}

// Constants
const TOTAL_POSITIONS = 54;
const TURNS_PER_SEASON = 8;

// Helper functions
const getCurrentSeason = (turn: number): 'odd' | 'even' | 'prime' => {
  const seasonIndex = Math.floor((turn - 1) / TURNS_PER_SEASON) % 3;
  return ['odd', 'even', 'prime'][seasonIndex] as 'odd' | 'even' | 'prime';
};

const initialGameState: GameState = {
  phase: 'deployment',
  currentRound: 1,
  currentTurn: 1,
  currentSeason: 'odd',
  deployedCount: 0,
  maxDeployment: TOTAL_POSITIONS,
  currentPlayer: 1
};

const initialGlobalPositionRecord = (): GlobalPositionRecord => {
  const record: GlobalPositionRecord = {};
  for (let i = 0; i < TOTAL_POSITIONS; i++) {
    record[i] = null;
  }
  return record;
};

// Zustand Store
export const useBattleStore = create<BattleStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      forces: [],
      selectedCard: null,
      gameState: initialGameState,
      globalPositionRecord: initialGlobalPositionRecord(),
      
      // Engagement system initial state
      engageMode: false,
      engagingUnit: null,
      targetUnit: null,

      // Actions
      addCard: (card: Card) => {
        set((state) => ({
          forces: [...state.forces, card]
        }), false, 'addCard');
      },

      removeCard: (instanceId: string) => {
        set((state) => ({
          forces: state.forces.filter(card => card.instanceId !== instanceId)
        }), false, 'removeCard');
      },

      selectCard: (card: Card | null) => {
        set({ selectedCard: card }, false, 'selectCard');
      },

      deployCard: (card: Card, globalPosition: number) => {
        set((state) => {
          // Update the card to deployed status
          const updatedForces = state.forces.map(f => 
            f.instanceId === card.instanceId ? { ...f, deployed: true } : f
          );

          // Update global position record
          const updatedRecord = {
            ...state.globalPositionRecord,
            [globalPosition]: { ...card, deployed: true }
          };

          // Update game state
          const updatedGameState = {
            ...state.gameState,
            deployedCount: state.gameState.deployedCount + 1
          };

          return {
            forces: updatedForces,
            globalPositionRecord: updatedRecord,
            gameState: updatedGameState,
            selectedCard: null
          };
        }, false, 'deployCard');
      },

      removeCardFromPosition: (globalPosition: number) => {
        set((state) => {
          const cardAtPosition = state.globalPositionRecord[globalPosition];
          if (!cardAtPosition) return state;

          // Update the card to undeployed status
          const updatedForces = state.forces.map(f => 
            f.instanceId === cardAtPosition.instanceId ? { ...f, deployed: false } : f
          );

          // Update global position record
          const updatedRecord = {
            ...state.globalPositionRecord,
            [globalPosition]: null
          };

          // Update game state
          const updatedGameState = {
            ...state.gameState,
            deployedCount: Math.max(0, state.gameState.deployedCount - 1)
          };

          return {
            forces: updatedForces,
            globalPositionRecord: updatedRecord,
            gameState: updatedGameState
          };
        }, false, 'removeCardFromPosition');
      },

      updateGameState: (updates: Partial<GameState>) => {
        set((state) => ({
          gameState: { ...state.gameState, ...updates }
        }), false, 'updateGameState');
      },

      nextTurn: () => {
        set((state) => {
          const newTurn = state.gameState.currentTurn + 1;
          const newSeason = getCurrentSeason(newTurn);
          const newPlayer = state.gameState.currentPlayer === 1 ? 2 : 1;
          const newRound = state.gameState.currentPlayer === 2 ? state.gameState.currentRound + 1 : state.gameState.currentRound;

          return {
            gameState: {
              ...state.gameState,
              currentTurn: newTurn,
              currentRound: newRound,
              currentSeason: newSeason,
              currentPlayer: newPlayer
            },
            selectedCard: null
          };
        }, false, 'nextTurn');
      },

      resetGame: () => {
        set({
          forces: [],
          selectedCard: null,
          gameState: initialGameState,
          globalPositionRecord: initialGlobalPositionRecord(),
          engageMode: false,
          engagingUnit: null,
          targetUnit: null
        }, false, 'resetGame');
      },

      // Engagement actions
      toggleEngageMode: () => {
        set((state) => ({
          engageMode: !state.engageMode,
          engagingUnit: null,
          targetUnit: null,
          selectedCard: null
        }), false, 'toggleEngageMode');
      },

      setEngagingUnit: (card: Card | null) => {
        set({ engagingUnit: card }, false, 'setEngagingUnit');
      },

      setTargetUnit: (card: Card | null) => {
        set({ targetUnit: card }, false, 'setTargetUnit');
      },

      executeEngagement: (attacker: Card, target: Card) => {
        // Placeholder for engagement logic
        console.log('🔥 ENGAGEMENT INITIATED!');
        console.log('Attacker:', attacker.name, attacker);
        console.log('Target:', target.name, target);
        
        // TODO: Implement your engagement chemistry here
        // This is where the magic happens!
        
        // Reset engagement state after combat
        set({
          engageMode: false,
          engagingUnit: null,
          targetUnit: null,
          selectedCard: null
        }, false, 'executeEngagement');
      },

      handleMove: (card: Card, fromPosition: number, toPosition: number) => {
        // Placeholder for movement logic
        console.log('🚀 MOVEMENT INITIATED!');
        console.log('Moving:', card.name, 'from position', fromPosition, 'to position', toPosition);
        
        set((state) => {
          const updatedRecord = { ...state.globalPositionRecord };
          updatedRecord[fromPosition] = null;
          updatedRecord[toPosition] = card;
          
          return {
            globalPositionRecord: updatedRecord,
            selectedCard: null
          };
        }, false, 'handleMove');
      },

      // Helper methods
      getCardAtPosition: (globalPosition: number) => {
        return get().globalPositionRecord[globalPosition] || null;
      },

      isPositionOccupied: (globalPosition: number) => {
        return get().globalPositionRecord[globalPosition] !== null;
      },

      getAvailableForces: () => {
        return get().forces.filter(card => !card.deployed);
      },

      getDeployedForces: () => {
        return get().forces.filter(card => card.deployed);
      }
    }),
    {
      name: 'battle-store', // name for devtools
    }
  )
);

// Custom hooks for specific data
export const useGameState = () => useBattleStore(state => state.gameState);
export const useSelectedCard = () => useBattleStore(state => state.selectedCard);
export const useForces = () => useBattleStore(state => state.forces);
export const useGlobalPositionRecord = () => useBattleStore(state => state.globalPositionRecord);

// Individual action hooks to prevent re-render issues
export const useAddCard = () => useBattleStore(state => state.addCard);
export const useSelectCard = () => useBattleStore(state => state.selectCard);
export const useDeployCard = () => useBattleStore(state => state.deployCard);
export const useUpdateGameState = () => useBattleStore(state => state.updateGameState);
export const useNextTurn = () => useBattleStore(state => state.nextTurn);
export const useResetGame = () => useBattleStore(state => state.resetGame);
export const useGetCardAtPosition = () => useBattleStore(state => state.getCardAtPosition);
export const useIsPositionOccupied = () => useBattleStore(state => state.isPositionOccupied);

// Engagement system hooks
export const useEngageMode = () => useBattleStore(state => state.engageMode);
export const useEngagingUnit = () => useBattleStore(state => state.engagingUnit);
export const useTargetUnit = () => useBattleStore(state => state.targetUnit);
export const useToggleEngageMode = () => useBattleStore(state => state.toggleEngageMode);
export const useSetEngagingUnit = () => useBattleStore(state => state.setEngagingUnit);
export const useSetTargetUnit = () => useBattleStore(state => state.setTargetUnit);
export const useExecuteEngagement = () => useBattleStore(state => state.executeEngagement);
export const useHandleMove = () => useBattleStore(state => state.handleMove);