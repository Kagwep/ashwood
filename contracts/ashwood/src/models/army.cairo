use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Army {
    #[key]
    pub commander_id: ContractAddress,
    #[key]
    pub army_id: u8,
    pub name: felt252,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct ArmyUnitUsed {
    #[key]
    pub commander_id: ContractAddress,
    #[key]
    pub army_id: u8,
    #[key]
    pub battlefield_id: u128,
    #[key]
    pub unit_id: u128,
    pub turn: u8,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct ArmyUnitPosition {
    #[key]
    pub commander_id: ContractAddress,
    #[key]
    pub army_id: u8,
    #[key]
    pub unit_id: u128,
    pub position_index: u8,
    pub battlefield_id: u128,
}

#[generate_trait]
pub impl ArmyImpl of ArmyTrait {
    #[inline(always)]
    fn new(commander_id: ContractAddress, army_id: u8, name: felt252) -> Army {
        Army {
            commander_id,
            army_id,
            name
        }
    }

    #[inline(always)]
    fn rename(ref self: Army, new_name: felt252) {
        self.name = new_name;
    }

    #[inline(always)]
    fn get_identifier(self: Army) -> (ContractAddress, u8) {
        (self.commander_id, self.army_id)
    }
}

#[generate_trait]
pub impl ArmyUnitPositionImpl of ArmyUnitPositionTrait {
    #[inline(always)]
    fn new(
        commander_id: ContractAddress,
        army_id: u8,
        unit_id: u128,
        position_index: u8,
        battlefield_id: u128,
    ) -> ArmyUnitPosition {
        ArmyUnitPosition {
            commander_id,
            army_id,
            unit_id,
            position_index,
            battlefield_id,
        }
    }

    #[inline(always)]
    fn update_position(ref self: ArmyUnitPosition, new_position: u8) {
        self.position_index = new_position;
    }

    #[inline(always)]
    fn is_deployed(self: ArmyUnitPosition) -> bool {
        self.position_index > 0 && self.position_index <= 54
    }
}

#[generate_trait]
pub impl ArmyUnitUsedImpl of ArmyUnitUsedTrait {
    #[inline(always)]
    fn new(
        commander_id: ContractAddress,
        army_id: u8,
        battlefield_id: u128,
        unit_id: u128,
        turn: u8
    ) -> ArmyUnitUsed {
        ArmyUnitUsed {
            commander_id,
            army_id,
            battlefield_id,
            unit_id,
            turn
        }
    }

    #[inline(always)]
    fn was_used_this_turn(self: ArmyUnitUsed, current_turn: u8) -> bool {
        self.turn == current_turn
    }
}