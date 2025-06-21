import { validateAndParseAddress } from 'starknet';
import { feltToStr, unpackU128toNumberArray } from './unpack';

export const sanitizeGame = (game: any) => {
  return {
    ...game,
    arena: bigIntAddressToString(game.arena_host),
    player_count: game.player_count,
  };
};


export const bigIntAddressToString = (address: bigint) => {
  return removeLeadingZeros(validateAndParseAddress(address));
};

export const shortAddress = (address: string, size = 4) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};

export const removeLeadingZeros = (address: string) => {
  // Check if the address starts with '0x' and then remove leading zeros from the hexadecimal part
  if (address.startsWith('0x')) {
    return '0x' + address.substring(2).replace(/^0+/, '');
  }
  // Return the original address if it doesn't start with '0x'
  return address;
};


export const ensureHexZeroPrefix = (address: string) => {
  // If address already starts with '0x0', return it as is
  if (address.startsWith('0x0')) {
    return address;
  }
  
  // If address starts with '0x' but not '0x0', insert a '0' after '0x'
  if (address.startsWith('0x')) {
    return '0x0' + address.substring(2);
  }
  
  // If address doesn't start with '0x', add '0x0' prefix
  return '0x0' + address;
};