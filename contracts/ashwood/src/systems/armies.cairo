use starknet::ContractAddress;
use ashwood::models::army::{Army, ArmyTrait, ArmyUnitPosition, ArmyUnitPositionTrait, ArmyUnitUsed, ArmyUnitUsedTrait};
use ashwood::models::unit::{Unit};

#[starknet::interface]
pub trait IArmy<T> {
    fn create_army(ref self: T, army_id: u8, name: felt252);
    fn rename_army(ref self: T, army_id: u8, new_name: felt252);
    fn remove_unit_from_army(ref self: T, army_id: u8, unit_id: u128);
    fn mark_unit_used(ref self: T, army_id: u8, battlefield_id: u128, unit_id: u128, turn: u8);
    fn is_unit_used_this_turn(ref self: T, army_id: u8, battlefield_id: u128, unit_id: u128, turn: u8) -> bool;
}

#[dojo::contract]
pub mod army {
    use super::{IArmy, Army, ArmyTrait, ArmyUnitPosition, ArmyUnitPositionTrait, ArmyUnitUsed, ArmyUnitUsedTrait, Unit};
    use starknet::{ContractAddress, get_caller_address};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct ArmyCreated {
        #[key]
        pub commander_id: ContractAddress,
        pub army_id: u8,
        pub name: felt252,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitDeployed {
        #[key]
        pub commander_id: ContractAddress,
        pub army_id: u8,
        pub unit_id: u128,
        pub position_index: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitMoved {
        #[key]
        pub commander_id: ContractAddress,
        pub army_id: u8,
        pub unit_id: u128,
        pub from_position: u8,
        pub to_position: u8,
    }

    #[abi(embed_v0)]
    impl ArmyImpl of IArmy<ContractState> {
        fn create_army(ref self: ContractState, army_id: u8, name: felt252) {
            let mut world = self.world_default();
            let commander_id = get_caller_address();
            
            let army = ArmyTrait::new(commander_id, army_id, name);
            world.write_model(@army);
            
            world.emit_event(@ArmyCreated { commander_id, army_id, name });
        }

        fn rename_army(ref self: ContractState, army_id: u8, new_name: felt252) {
            let mut world = self.world_default();
            let commander_id = get_caller_address();
            
            let mut army: Army = world.read_model((commander_id, army_id));
            army.rename(new_name);
            world.write_model(@army);
        }


        fn remove_unit_from_army(ref self: ContractState, army_id: u8, unit_id: u128) {
            let mut world = self.world_default();
            let commander_id = get_caller_address();
            
            let mut unit_position: ArmyUnitPosition = world.read_model((commander_id, army_id, unit_id));
            unit_position.update_position(0); // 0 = not deployed
            world.write_model(@unit_position);
        }

        fn mark_unit_used(
            ref self: ContractState, 
            army_id: u8, 
            battlefield_id: u128, 
            unit_id: u128, 
            turn: u8
        ) {
            let mut world = self.world_default();
            let commander_id = get_caller_address();
            
            let unit_used = ArmyUnitUsedTrait::new(commander_id, army_id, battlefield_id, unit_id, turn);
            world.write_model(@unit_used);
        }


        fn is_unit_used_this_turn(
            ref self: ContractState, 
            army_id: u8, 
            battlefield_id: u128, 
            unit_id: u128, 
            turn: u8
        ) -> bool {
            let world = self.world_default();
            let commander_id = get_caller_address();
            
            let unit_used: ArmyUnitUsed = world.read_model((commander_id, army_id, battlefield_id, unit_id));
            unit_used.was_used_this_turn(turn)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"ashwood")
        }
    }
}