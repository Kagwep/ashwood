// Types
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


type GlobalPositionRecord = Record<number, Card | null>;