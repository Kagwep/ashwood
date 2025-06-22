import { type Network } from './utils/ashwood';
import { MANIFEST_DEV, MANIFEST_MAINNET, MANIFEST_SEPOLIA } from '../dojoConfig';


// Sepolia network constants
export const SEPOLIA = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/sepolia",
    TORII_URL: "https://api.cartridge.gg/x/ashwood-1/torii",
    ACTIONS_ADDRESS: "0x6b744826059f537ed183edd16b263f0431aeee5725cfce99019c8790420f885",
    UNITS_ADDRESS: "0x6999e7940f0ad1cbae1ce634443f376245bf1759398721e76912b5b88a4ab5d",
    BATTLEFIELDS_ADDRESS: "0x1cf1dadd01c4c1df4173649d337195096aada05f55ee208a4c09f5afafd3d71",
    ARMIES_ADDRESS: "0x75ba92740c3772962a7b9b980a052167ba2955f1cc0b358c7bcc877c29e37ed",
    WORLD_ADDRESS: MANIFEST_SEPOLIA.world.address,//,
    MANIFEST: MANIFEST_SEPOLIA, 
  };
  
  // Mainnet network constants
  export const MAINNET = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/mainnet", 
    TORII_URL: "https://api.cartridge.gg/x/ashwood-2/torii", 
    ACTIONS_ADDRESS: "",
    UNITS_ADDRESS: "",
    BATTLEFIELDS_ADDRESS: "",
    ARMIES_ADDRESS: "",
    WORLD_ADDRESS: MANIFEST_MAINNET.world.address,//MANIFEST_MAINNET.world.address,
    MANIFEST: MANIFEST_MAINNET, 
  };


  // Katana/local network constants
export const KATANA = {
    TORII_RPC_URL: "", // Default Katana RPC
    TORII_URL: "http://localhost:8080",
    ACTIONS_ADDRESS: "0x0",
    PLAYERS_ADDRESS: "0x0",
    SQUAD_ADDRESS: "0x0",
    TMATCH_ADDRESS: "0x0",
    WORLD_ADDRESS: MANIFEST_DEV.world.address,
    MANIFEST: MANIFEST_DEV,  
  };
  
  // Helper function to get constants based on network
export const getNetworkConstants = (network: Network) => {
    switch (network) {
      case 'sepolia':
        return SEPOLIA;
      case 'mainnet':
        return MAINNET;
      case 'katana':
      default:
        return KATANA;
    }
  };