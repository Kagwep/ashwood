import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { Connector, StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider, constants } from 'starknet'

import { getNetworkConstants } from './constants'


import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'
import {type ColorMode,type ControllerOptions, type SessionPolicies } from '@cartridge/controller'
import type { Network } from './utils/ashwood'

interface StarknetProviderProps extends PropsWithChildren {
  network: Network;
}

export function StarknetProvider({ children, network }: StarknetProviderProps) {
  // Get network constants based on the current network
  const networkConstants = getNetworkConstants(network);
  console.log("StarknetProvider using network:", network);
  
  // Define session policies
  const policies: SessionPolicies = {
    contracts: {
      [networkConstants.ACTIONS_ADDRESS]: {
        methods: [
          { entrypoint: "commit" },
          { entrypoint: "reveal" },
          { entrypoint: "substitute_player" },
          { entrypoint: "use_tactic_card" },
        ],
      },
      [networkConstants.PLAYERS_ADDRESS]: {
        methods: [
          { entrypoint: "create_card" },
          { entrypoint: "update_stats" },
          { entrypoint: "update_rarity" },
          { entrypoint: "create_special_ability" },
        ],
      },
      [networkConstants.SQUAD_ADDRESS]: {
        methods: [
          { entrypoint: "create_squad" },
          { entrypoint: "change_formation" },
          { entrypoint: "add_card_to_position" },
          { entrypoint: "replace_card_to_position" },
          { entrypoint: "remove_card_from_position" },
          { entrypoint: "rename_squad" },
          { entrypoint: "calculate_chemistry" },
        ],
      },
      [networkConstants.TMATCH_ADDRESS]: {
        methods: [
          { entrypoint: "create_match" },
          { entrypoint: "start_match" },
          { entrypoint: "join_match" },
        ],
      },
    },
  };
  
  const colorMode: ColorMode = "dark";
  const theme = "";
  const namespace = "touchline";
  
  const getChainIdForNetwork = (networkValue: Network) => {
    switch (networkValue) {
      case 'sepolia':
        return constants.StarknetChainId.SN_SEPOLIA;
      case 'mainnet':
        return constants.StarknetChainId.SN_MAIN;
      case 'katana':
      default:
        return constants.StarknetChainId.SN_MAIN;
    }
  };
  
  const options: ControllerOptions = {
    chains: [
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
      },
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
      },
    ],
    defaultChainId: getChainIdForNetwork(network),
    namespace,
    policies,
    theme,
    colorMode,
  };
  
  const cartridge = new ControllerConnector(
    options,
  ) as never as Connector;
  
  function provider(chain: Chain) {
    switch (chain) {
      case mainnet:
        return new RpcProvider({
          nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
        });
      case sepolia:
      default:
        return new RpcProvider({
          nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
        });
    }
  }
  
  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, sepolia]}
      connectors={[cartridge]}
      explorer={starkscan}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}