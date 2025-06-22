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
        { entrypoint: "move_unit" },
        { entrypoint: "attack_unit" },
        { entrypoint: "retreat_unit" },
        ],
      },
      [networkConstants.UNITS_ADDRESS]: {
        methods: [
        { entrypoint: "create_unit" },
        { entrypoint: "update_unit_stats" },
        { entrypoint: "check_advantage" },
        { entrypoint: "is_ranged" },
        { entrypoint: "can_support" }
        ],
      },
      [networkConstants.ARMIES_ADDRESS]: {
        methods: [
        { entrypoint: "create_army" },
        { entrypoint: "rename_army" },
        { entrypoint: "add_unit_to_army" },
        { entrypoint: "remove_unit_from_army" },
        { entrypoint: "mark_unit_used" },
        { entrypoint: "is_unit_used_this_turn" },
        ],
      },
      [networkConstants.BATTLEFIELDS_ADDRESS]: {
        methods: [
          { entrypoint: "create_battle" },
          { entrypoint: "join_battle" },
          { entrypoint: "start_battle" },
          { entrypoint: "deploy_unit_to_battlefield" },
        ],
      },
    },
  };
  
  const colorMode: ColorMode = "dark";
  const theme = "";
  const namespace = "ashwood";
  
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