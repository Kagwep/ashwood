import { create } from 'zustand';
import GameState from './gamestate';

export type Network =
  | "mainnet"
  | "katana"
  | "sepolia"
  | "localKatana"
  | undefined;


export type ScreenPage =
  | "start"
  | "play"
  | "market"
  | "inventory"
  | "beast"
  | "leaderboard"
  | "upgrade"
  | "profile"
  | "encounters"
  | "guide"
  | "settings"
  | "player"
  | "wallet"
  | "tutorial"
  | "onboarding"
  | "create adventurer"
  | "future";

interface State {
  onboarded: boolean;
  handleOnboarded: () => void;
  handleOffboarded: () => void;
  game_id: number | undefined;
  set_game_id: (game_id: number) => void;
  battle_id: number | undefined;
  set_battle_id: (battle_id: number) => void;
  army_id: number | undefined;
  set_army_id: (army_id: number) => void;
  game_state: GameState;
  set_game_state: (game_state: GameState) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
  isContinentMode: boolean;
  setContinentMode: (mode: boolean) => void;
  highlighted_region: number | null;
  setHighlightedRegion: (region: number | null) => void;
//   battleReport: Battle | null;
//   setBattleReport: (report: Battle | null) => void;
  player_name: string;
  setPlayerName: (name: string) => void;
  lastDefendResult: Event | null;
  setLastDefendResult: (result: Event | null) => void;
//   lastBattleResult: Battle | null;
//   setLastBattleResult: (battle: Battle | null) => void;
  tilesConqueredThisTurn: number[];
  setTilesConqueredThisTurn: (tile: number[]) => void;
  round_limit: number;
  setRoundLimit: (limit: number) => void;
  username: string;
  setUsername: (value: string) => void;
  invader_id: string;
  setInvaderId: (value: string) => void;
  defender_id: string;
  setDefenderId: (value: string) => void;
  isWalletPanelOpen: boolean;
  setWalletPanelOpen: (isOpen: boolean) => void;
  network: Network;
  setNetwork: (value: Network) => void;
  onMainnet: boolean;
  onSepolia: boolean;
  onKatana: boolean;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  loginScreen: boolean;
  dojoConfig: any;
  setDojoConfig: (value: any) => void;
  setLoginScreen: (value: boolean) => void;
  screen: ScreenPage;
  setScreen: (value: ScreenPage) => void;
}

export const useAshwoodStore = create<State>((set) => ({

  game_id: -1,
  set_game_id: (game_id: number) => {
    set(() => ({ game_id }));
  },
  battle_id: -1,
  set_battle_id: (battle_id: number) => {
    set(() => ({ battle_id }));
  },
    army_id: -1,
  set_army_id: (army_id: number) => {
    set(() => ({ army_id }));
  },
  game_state: GameState.MainMenu,
  set_game_state: (game_state: GameState) => set(() => ({ game_state })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
  isContinentMode: false,
  setContinentMode: (mode: boolean) => set(() => ({ isContinentMode: mode })),
  highlighted_region: null,
  setHighlightedRegion: (region: number | null) => set(() => ({ highlighted_region: region })),
//   battleReport: null,
//   setBattleReport: (report: Battle | null) => set(() => ({ battleReport: report })),
  player_name: '',
  setPlayerName: (name: string) => set(() => ({ player_name: name })),
  onboarded: false,
  handleOnboarded: () => {
    set({ onboarded: true });
  },
  handleOffboarded: () => {
    set({ onboarded: false });
  },
  lastDefendResult: null,
  setLastDefendResult: (result: Event | null) => set(() => ({ lastDefendResult: result })),
//   lastBattleResult: null,
//   setLastBattleResult: (battle: Battle | null) => set(() => ({ lastBattleResult: battle })),
  username: "",
  setUsername: (value) => set({ username: value }),
  invader_id: "",
  setInvaderId: (value) => set({ invader_id: value }),
  defender_id: "",
  setDefenderId: (value) => set({ defender_id: value }),
  tilesConqueredThisTurn: [],
  setTilesConqueredThisTurn: (tile: number[]) => set(() => ({ tilesConqueredThisTurn: tile })),
  round_limit: 15,
  setRoundLimit: (limit: number) => set(() => ({ round_limit: limit })),
  isWalletPanelOpen: false,
  setWalletPanelOpen: (isOpen: boolean) => set(() => ({ isWalletPanelOpen: isOpen })),
  network: undefined,
  setNetwork: (value) => {
    set({ network: value });
    set({ onMainnet: value === "mainnet" });
    set({ onSepolia: value === "sepolia" });
    set({ onKatana: value === "katana" || value === "localKatana" });
  },
  onMainnet: false,
  onSepolia: false,
  onKatana: false,
  isMuted: false,
  setIsMuted: (value) => set({ isMuted: value }),
  loginScreen: false,
  dojoConfig: undefined,
  setDojoConfig: (value) => {
    set({ dojoConfig: value });
  },
  setLoginScreen: (value) => set({ loginScreen: value }),
  screen: "start",
  setScreen: (value) => set({ screen: value }),
}));