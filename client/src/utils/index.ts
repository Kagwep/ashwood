import { hash, shortString, starknetId, type Uint256 } from 'starknet';
import type { BigNumberish } from 'starknet';
import { type ClassValue, clsx } from "clsx"
import * as starknetH from '@scure/starknet';
import { twMerge } from "tailwind-merge"

import { removeLeadingZeros } from './sanitizer';
import type { ArmyUnitPosition, Unit } from '../dojogen/models.gen';




// Secret key for adding entropy to the hash

export const stringToFelt = (v: string): string => (v ? shortString.encodeShortString(v) : '0x0')

const SECRET_KEY = stringToFelt("0xb79f5af6b");

const SECRET_KEY_FELT = BigInt(SECRET_KEY);

/**
 * Converts a string to a felt252 (bigint) representation in Cairo
 * @param str String to convert
 */
function stringToFelt252(str: string): bigint {
  // Convert string to bytes
  const bytes = new TextEncoder().encode(str);
  let result = 0n;
  
  // Convert bytes to a single felt252 (max 31 bytes for felt252)
  for (let i = 0; i < Math.min(bytes.length, 31); i++) {
    result = (result << 8n) | BigInt(bytes[i]);
  }
  
  return result;
}

/**
 * Converts a string to a bigint representation suitable for Poseidon
 * (Note: StarkNet's Poseidon operates on felts)
 * @param str String to convert
 */
function stringToBigint(str: string): bigint {
    const bytes = new TextEncoder().encode(str);
    let result = 0n;
    for (let i = 0; i < bytes.length; i++) {
      result = (result << 8n) | BigInt(bytes[i]);
    }
    return result;
  }


export function parseStarknetError(error: any): string {
    console.log(error);

    if (error?.message?.includes('RPC')) {
        try {
            const simpleMatch = error.message.match(/Failure reason: (0x[a-fA-F0-9]+) \('([^']+)'\)/);
            if (simpleMatch) {
                return simpleMatch[2];
            }

            const errorMatch = error.message.match(/execution_error":"([^"]+)"/);
            if (errorMatch) {
                const executionError = errorMatch[1];

                const hexMatch = executionError.match(/0x[a-fA-F0-9]+\s\('([^']+)'\)/);
                if (hexMatch) {
                    return hexMatch[1];
                }

                const readableMatch = executionError.match(/Failure reason: [^']*'([^']+)'/);
                if (readableMatch) {
                    return readableMatch[1];
                }

                const quotedMatch = executionError.match(/'([^']+)'/);
                if (quotedMatch) {
                    return quotedMatch[1];
                }
            }
        } catch (parseError) {
            console.error('Error parsing Starknet error:', parseError);
        }
    }

    return error?.message || 'Unknown Starknet error occurred';
}



export const getRandomPlayerImage = (): string => {
  const randomNumber = Math.floor(Math.random() * 9) + 1;
  return `/player${randomNumber}.png`;
};



export const bigintToU256 = (v: BigNumberish): Uint256 => ({
    low: BigInt(v) & 0xffffffffffffffffffffffffffffffffn,
    high: BigInt(v) >> 128n,
  })

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }


  export const getBattleStatusColor = (status) => {
  switch (status) {
    case 'Initialized':
      return 'bg-gray-600/50 border-gray-400 text-gray-200';
    case 'WaitingForAttacker':
      return 'bg-yellow-600/50 border-yellow-400 text-yellow-200';
    case 'Deploying':
      return 'bg-blue-600/50 border-blue-400 text-blue-200';
    case 'Strategizing':
      return 'bg-purple-600/50 border-purple-400 text-purple-200';
    case 'Engaged':
      return 'bg-red-600/50 border-red-400 text-red-200';
    case 'DefenderVictory':
    case 'AttackerVictory':
      return 'bg-green-600/50 border-green-400 text-green-200';
    case 'Stalemate':
      return 'bg-orange-600/50 border-orange-400 text-orange-200';
    case 'Retreat':
    case 'Aborted':
      return 'bg-gray-600/50 border-gray-400 text-gray-200';
    case 'RevealPending':
      return 'bg-amber-600/50 border-amber-400 text-amber-200';
    default:
      return 'bg-gray-600/50 border-gray-400 text-gray-200';
  }
};

export function getUnitsByIds(units: Record<string, Unit>, unitIds: string[]): Record<string, Unit> {
  const result: Record<string, Unit> = {};
  
  unitIds.forEach(id => {
    if (units[id]) {
      result[id] = units[id];
    }
  });
  
  return result;
}

export function getAllUnitIds(
  armyPositions: Record<string, ArmyUnitPosition>, 
  commanderId?: string,
  armyId?: string
): string[] {
  return Object.values(armyPositions)
    .filter(position => 
      (!commanderId || removeLeadingZeros(position.commander_id) === commanderId) &&
      (!armyId || position.army_id.toString() === armyId.toString())
    )
    .map(position => position.unit_id.toString());
}