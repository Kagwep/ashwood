use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Unit {
    #[key]
    pub id: u128,
    pub player_name: felt252,
    pub unit_class: UnitClass,
    pub attack: u8,
    pub defense: u8,
    pub speed: u8,
    pub special: u8,
}

// Unit Class enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum UnitClass {
    Infantry,
    Pike,
    Archer,
    Cavalry,
    Elite,
    Support,
}

#[generate_trait]
pub impl UnitImpl of UnitTrait {
   #[inline(always)]
   fn new(
       id: u128,
       player_name: felt252,
       unit_class: UnitClass,
       attack: u8,
       defense: u8,
       speed: u8,
       special: u8,
   ) -> Unit {
       Unit {
           id,
           player_name,
           unit_class,
           attack,
           defense,
           speed,
           special,
       }
   }

   #[inline(always)]
   fn get_total_combat_power(self: Unit) -> u8 {
       self.attack + self.defense + self.speed + self.special
   }

   #[inline(always)]
   fn get_class_bonus(self: Unit) -> u8 {
       match self.unit_class {
           UnitClass::Infantry => 2,
           UnitClass::Pike => 3,
           UnitClass::Archer => 1,
           UnitClass::Cavalry => 4,
           UnitClass::Elite => 5,
           UnitClass::Support => 1,
       }
   }

   #[inline(always)]
   fn has_advantage_over(self: Unit, target: Unit) -> bool {
       match (self.unit_class, target.unit_class) {
           (UnitClass::Pike, UnitClass::Cavalry) => true,
           (UnitClass::Cavalry, UnitClass::Archer) => true,
           (UnitClass::Archer, UnitClass::Infantry) => true,
           (UnitClass::Infantry, UnitClass::Pike) => true,
           (UnitClass::Elite, _) => true,
           _ => false
       }
   }

   #[inline(always)]
   fn can_provide_support(self: Unit) -> bool {
       self.unit_class == UnitClass::Support || self.special >= 8
   }

   #[inline(always)]
   fn get_movement_range(self: Unit) -> u8 {
       match self.unit_class {
           UnitClass::Cavalry => self.speed / 2 + 2,
           UnitClass::Archer => self.speed / 3 + 1,
           UnitClass::Infantry => self.speed / 4 + 1,
           UnitClass::Pike => self.speed / 4,
           UnitClass::Elite => self.speed / 2 + 1,
           UnitClass::Support => self.speed / 3,
       }
   }

   #[inline(always)]
   fn is_ranged_unit(self: Unit) -> bool {
       match self.unit_class {
           UnitClass::Archer | UnitClass::Support => true,
           _ => false
       }
   }

   #[inline(always)]
   fn update_stats(ref self: Unit, attack: u8, defense: u8, speed: u8, special: u8) {
       self.attack = attack;
       self.defense = defense;
       self.speed = speed;
       self.special = special;
   }
}