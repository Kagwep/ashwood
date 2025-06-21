use starknet::ContractAddress;
use ashwood::models::unit::{Unit, UnitTrait, UnitClass};

#[starknet::interface]
pub trait IUnits<T> {
    fn create_unit(
        ref self: T, 
        id: u128, 
        player_name: felt252, 
        unit_class: UnitClass, 
        attack: u8, 
        defense: u8, 
        speed: u8, 
        special: u8
    );
    fn update_unit_stats(ref self: T, id: u128, attack: u8, defense: u8, speed: u8, special: u8);
    fn check_advantage(ref self: T, attacker_id: u128, target_id: u128) -> bool;
    fn is_ranged(ref self: T, id: u128) -> bool;
    fn can_support(ref self: T, id: u128) -> bool;
}

#[dojo::contract]
pub mod units {
    use super::{IUnits, Unit, UnitTrait, UnitClass};
    use starknet::{ContractAddress, get_caller_address};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitCreated {
        #[key]
        pub player: ContractAddress,
        pub id: u128,
        pub player_name: felt252,
        pub unit_class: UnitClass,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitStatsUpdated {
        #[key]
        pub player: ContractAddress,
        pub id: u128,
        pub attack: u8,
        pub defense: u8,
        pub speed: u8,
        pub special: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct CombatCalculated {
        #[key]
        pub attacker_id: u128,
        pub target_id: u128,
        pub damage: u8,
        pub has_advantage: bool,
    }

    #[abi(embed_v0)]
    impl UnitsImpl of IUnits<ContractState> {
        fn create_unit(
            ref self: ContractState,
            id: u128,
            player_name: felt252,
            unit_class: UnitClass,
            attack: u8,
            defense: u8,
            speed: u8,
            special: u8
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            // Verify unit doesn't already exist
            let existing_unit: Unit = world.read_model(id);
            assert(existing_unit.attack == 0, 'Unit already exists');
            
            let unit = UnitTrait::new(id, player_name, unit_class, attack, defense, speed, special);
            world.write_model(@unit);
            
            world.emit_event(@UnitCreated { 
                player, 
                id, 
                player_name, 
                unit_class 
            });
        }

        fn update_unit_stats(
            ref self: ContractState, 
            id: u128, 
            attack: u8, 
            defense: u8, 
            speed: u8, 
            special: u8
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            let mut unit: Unit = world.read_model(id);
            assert(unit.id != 0, 'Unit does not exist');
            
            unit.update_stats(attack, defense, speed, special);
            world.write_model(@unit);
            
            world.emit_event(@UnitStatsUpdated { 
                player, 
                id, 
                attack, 
                defense, 
                speed, 
                special 
            });
        }

        fn check_advantage(ref self: ContractState, attacker_id: u128, target_id: u128) -> bool {
            let world = self.world_default();
            let attacker: Unit = world.read_model(attacker_id);
            let target: Unit = world.read_model(target_id);
            
            assert(attacker.id != 0, 'Attacker does not exist');
            assert(target.id != 0, 'Target does not exist');
            
            attacker.has_advantage_over(target)
        }


        fn is_ranged(ref self: ContractState, id: u128) -> bool {
            let world = self.world_default();
            let unit: Unit = world.read_model(id);
            assert(unit.id != 0, 'Unit does not exist');
            unit.is_ranged_unit()
        }

        fn can_support(ref self: ContractState, id: u128) -> bool {
            let world = self.world_default();
            let unit: Unit = world.read_model(id);
            assert(unit.id != 0, 'Unit does not exist');
            unit.can_provide_support()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"ashwood")
        }
    }
}