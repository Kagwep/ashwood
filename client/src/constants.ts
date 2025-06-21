import { type Network } from './utils/ashwood';
import { MANIFEST_DEV, MANIFEST_MAINNET, MANIFEST_SEPOLIA } from '../dojoConfig';


// Sepolia network constants
export const SEPOLIA = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/sepolia",
    TORII_URL: "https://api.cartridge.gg/x/touchline-1/torii",
    ACTIONS_ADDRESS: "0x133ea5391240bd29d54a3e5bbc202de979b96f7d8b639078713dc770cfc0ded",
    PLAYERS_ADDRESS: "0xc833c02d5514cf7b11c429814f879fe6dbb22f6a941ca18446f60bbe8d6692",
    SQUAD_ADDRESS: "0x1490fbb97785b74c194a468c4cdf21e61136c1dbb36f5bb52e4f549bd22a08f",
    TMATCH_ADDRESS: "0x3f63a9a408d24e08d067946b4bb67b341b827415a0f79e6ea405569b0d56e9e",
    WORLD_ADDRESS: MANIFEST_SEPOLIA.world.address,//,
    MANIFEST: MANIFEST_SEPOLIA, 
  };
  
  // Mainnet network constants
  export const MAINNET = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/mainnet", 
    TORII_URL: "https://api.cartridge.gg/x/command-nexus-2/torii", 
    ACTIONS_ADDRESS: "0x5c50a92b3a9608da4fddc267438f705860a8921b5d7d228d1a2bb722e854b6c",
    PLAYERS_ADDRESS: "0x1e822ce8ed4b685dc790e5a93b42f7a3158a741cb9558a64347bd68432a7174",
    SQUAD_ADDRESS: "0x5c50a92b3a9608da4fddc267438f705860a8921b5d7d228d1a2bb722e854b6c",
    TMATCH_ADDRESS: "0x1e822ce8ed4b685dc790e5a93b42f7a3158a741cb9558a64347bd68432a7174",
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