use starknet::ContractAddress;
use ashwood::models::battlefield::{BattleField, BattleFieldTrait, BattleStatus, ActionType, SeasonType,BattleFieldPosition,BattlefieldStats,GridPosition,BattleZone};
use ashwood::models::unit::{Unit, UnitTrait};
use ashwood::models::army::{Army, ArmyUnitPosition, ArmyUnitUsed, ArmyUnitPositionTrait, ArmyUnitUsedTrait};

#[starknet::interface]
pub trait IBattleFields<T> {
    fn create_battle(
        ref self: T,
        battlefield_id: u128,
        invader_army_id: u8,
        battle_name: felt252
    );
    fn join_battle(
        ref self: T,
        battlefield_id: u128,
        army_id: u8
    );
    fn start_battle(
        ref self: T,
        battlefield_id: u128,
    );
    fn deploy_unit_to_battlefield(
        ref self: T,
        battlefield_id: u128,
        army_id: u8,
        unit_id: u128,
        global_position: u8
    );

}

#[dojo::contract]
pub mod battlefields {
    use super::{IBattleFields, BattleField, BattleFieldTrait, BattleStatus, ActionType, SeasonType,BattleZone, 
                Unit, UnitTrait, Army, ArmyUnitPosition, ArmyUnitUsed, ArmyUnitPositionTrait, ArmyUnitUsedTrait,BattleFieldPosition,BattlefieldStats,GridPosition};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use core::num::traits::Zero;



    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct BattleCreated {
        #[key]
        pub battlefield_id: u128,
        pub defender: ContractAddress,
        pub invader: ContractAddress,
        pub defender_army_id: u8,
        pub invader_army_id: u8,
        pub created_at: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitDeployedToBattle {
        #[key]
        pub battlefield_id: u128,
        pub army_id: u8,
        pub unit_id: u128,
        pub global_position: u8,
        pub owner: ContractAddress,
        pub turn: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitMoved {
        #[key]
        pub battlefield_id: u128,
        pub army_id: u8,
        pub unit_id: u128,
        pub from_position: u8,
        pub to_position: u8,
        pub turn: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitEngagement {
        #[key]
        pub battlefield_id: u128,
        pub attacker_army_id: u8,
        pub attacker_unit_id: u128,
        pub target_unit_id: u128,
        pub damage_dealt: u8,
        pub turn: u8,
    }

    #[abi(embed_v0)]
    impl BattleFieldsImpl of IBattleFields<ContractState> {
        fn create_battle(
            ref self: ContractState,
            battlefield_id: u128,
            invader_army_id: u8,
            battle_name: felt252,
        ) {
            let mut world = self.world_default();
            let timestamp = get_block_timestamp();

            let player = get_caller_address();



            let battle = BattleFieldTrait::new(
                battlefield_id,
                defender_commander_id: Zero::zero(),
                invader_commander_id: player,
                battle_name: battle_name,
                defender_army_id: 0,//defender_army_id
                invader_army_id : invader_army_id,
                defender_score:0, // defender_score
                invader_score: 0, // invader_score
                current_turn: 1, // current_turn
                turn_deadline: 0,
                season: 1,
                created_at: timestamp,
                last_action_timestamp: timestamp
            );
            
            world.write_model(@battle);
            
            world.emit_event(@BattleCreated { 
                battlefield_id, 
                defender: Zero::zero(), 
                invader: player,
                defender_army_id: 0,
                invader_army_id,
                created_at: timestamp 
            });
        }

        fn join_battle(
            ref self: ContractState,
            battlefield_id: u128,
            army_id: u8
        ){
            let mut world = self.world_default();
            let timestamp = get_block_timestamp();

            let player = get_caller_address();

            let mut battle: BattleField = world.read_model(battlefield_id);

            assert(battle.invader_commander_id != Zero::zero(), 'Battle not active');
            assert(battle.defender_commander_id == Zero::zero(), 'Battle  active');
            assert(battle.status == BattleStatus::WaitingForAttacker, 'Battle not active');


            battle.defender_commander_id = player;
            battle.status = BattleStatus::Initialized;
            battle.defender_army_id = army_id;


            world.write_model(@battle);


        }   

        fn deploy_unit_to_battlefield(
            ref self: ContractState,
            battlefield_id: u128,
            army_id: u8,
            unit_id: u128,
            global_position: u8
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let timestamp = get_block_timestamp();
            
            // Verify battle exists and is active
            let mut battle: BattleField = world.read_model(battlefield_id);
            assert(battle.is_active(), 'Battle not active');
            assert(battle.is_player_turn(player), 'Not your turn');

            // Verify army ownership
            let army: Army = world.read_model((player, army_id));

            if battle.defender_commander_id == player{
                assert(battle.defender_army_id == army.army_id, 'Army not created');
                assert((global_position >= 28 && global_position <= 54), 'Not Your territory');
            }else{
                assert(battle.invader_army_id == army.army_id, 'Army not created');
                assert(global_position <= 27, 'Not Your territory');
            }
            
            // Verify unit exists
            let unit: Unit = world.read_model(unit_id);
            assert(unit.id != 0, 'Unit does not exist');

            let mut battlefield_stats:BattlefieldStats = world.read_model(battlefield_id);

            if battle.defender_commander_id == player{ 
                assert(battlefield_stats.defender_units_deployed <= 18, 'Max Units Deployed');
            }else {
                assert(battlefield_stats.invader_units_deployed <= 18, 'Max Units Deployed');
            }

            let season: SeasonType  = self.get_season(battle.season);

            
            // Validate position for current season
            assert(self.validate_position_for_season(global_position, season), 'Invalid position for season');
            
            // Check if unit is already deployed
            let existing_position: ArmyUnitPosition = world.read_model((player, army_id, unit_id));
            assert(!existing_position.is_deployed(), 'Unit already deployed');
            
            // Check if position is occupied by checking all armies in battle
            let to_deploy_position: BattleFieldPosition = world.read_model((battlefield_id, global_position));

            assert(!to_deploy_position.is_occupied, 'Position Occupied');

            //Validate supply chain
            let supply_chain_validity = self.validate_supply_chain(
            battlefield_id,
            player,
            army_id,
            target_position: global_position
            );

            assert(supply_chain_validity, 'No Supply Chain');



            // Deploy unit using ArmyUnitPosition
            let unit_position = ArmyUnitPositionTrait::new(player, army_id, unit_id, global_position,battlefield_id);
            world.write_model(@unit_position);

            if battle.defender_commander_id == player{ 
                battlefield_stats.defender_units_deployed += 1;
            }else {
                battlefield_stats.invader_units_deployed += 1;
            }

            battlefield_stats.turns_remaining -= 1;
            battlefield_stats.last_updated = timestamp;

            world.write_model(@battlefield_stats);

            world.write_model(
                @BattleFieldPosition {
                battlefield_id,
                position: global_position,
                unit_id,
                is_occupied: true,
                owner: player,
                army_id: army_id,
                }
            );

            battle.advance_turn();

            battle.status = BattleStatus::Deploying;

            battle.season += 1;

            if battle.season > 24 {
                battle.season = 1;
            }

            world.write_model(@battle);
            
            world.emit_event(@UnitDeployedToBattle { 
                battlefield_id, 
                army_id,
                unit_id, 
                global_position, 
                owner: player, 
                turn: battle.current_turn 
            });
        }


        fn start_battle(
            ref self: ContractState,
            battlefield_id: u128,
        ){
            let mut world = self.world_default();
            let player = get_caller_address();
            
            let timestamp = get_block_timestamp();
            
            // Verify battle exists and is active
            let mut battle: BattleField = world.read_model(battlefield_id);
            assert(battle.is_active(), 'Battle not active');
   

            battle.status = BattleStatus::Engaged;

             world.write_model(
                @BattlefieldStats {
                battlefield_id,
                max_turns: 120,
                turns_remaining: 120,
                invader_units_deployed: 0,
                defender_units_deployed: 0,
                invader_units_remaining: 18,
                defender_units_remaining: 18,
                invader_units_eliminated: 0,
                defender_units_eliminated: 0,
                battle_duration:0,
                invader_retreat: 0,
                defender_retreat: 0,
                last_updated: timestamp,
                is_complete: false,
            }
            );

            world.write_model(@battle);
        }

    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"ashwood")
        }

      fn validate_position_for_season(self: @ContractState, position: u8, season: SeasonType) -> bool {
        let  PRIME_POSITIONS: Array<u8> = array![
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53
            ];
            match season {
                SeasonType::Odd => position % 2 == 1,
                SeasonType::Even => position % 2 == 0,
                SeasonType::Prime => {
                    let mut i = 0;
                    loop {
                        if i >= PRIME_POSITIONS.len() {
                            break false;
                        }
                        if *PRIME_POSITIONS.at(i) == position {
                            break true;
                        }
                        i += 1;
                    }
                },
                _ => false,
            }
        }

 

    fn validate_supply_chain(
        ref self: ContractState,
        battlefield_id: u128,
        player: ContractAddress,
        army_id: u8,
        target_position: u8
        ) -> bool {
            let mut world = self.world_default();
            let  battle: BattleField = world.read_model(battlefield_id);
            
            // Determine if player is attacker or defender
            let is_attacker = player != battle.defender_commander_id;
            
            // Get zone info
            let zone_id = self.get_zone_id(target_position);
            let mut battle_zone: BattleZone = world.read_model((battlefield_id, zone_id));
            
            // STEP 1: Check if first deployment
            if !battle_zone.initial_deployment {
                // First deployment - only accept baseline positions
                if self.is_baseline_position(target_position, is_attacker) {
                    world.write_model(@BattleZone {
                    battlefield_id,
                    zone_position_id: zone_id, // 19, 28, 37, 46, 55, 64 (zone identifiers)
                    initial_deployment: true,
                    has_units: true,
                    first_unit_position: target_position,  
                    });
                    return true;
                } else {
                    return false; // Must deploy on baseline first
                }
            }
            
            // STEP 2: Not first deployment - check if position is in middle
            if self.is_position_in_middle(target_position, is_attacker) && !self.is_central_position_deployed(battlefield_id, zone_id) {
                return true; // Middle positions always allowed after first deployment
            }
            
            // STEP 3: Check using reverse concept - is central position deployed?
            if self.is_central_position_deployed(battlefield_id, zone_id) {
                return true; // Central control allows free deployment
            }
            
            // STEP 4: Check horizontal neighbors for existing deployment
            return self.check_horizontal_neighbors_deployed(battlefield_id, target_position);
        }

        fn is_baseline_position(self: @ContractState, target_position: u8, is_attacker: bool) -> bool {
            if is_attacker {
                // Attacker baseline positions: 1,2,3 | 10,11,12 | 19,20,21
                if target_position == 1 { return true; }
                if target_position == 2 { return true; }
                if target_position == 3 { return true; }
                if target_position == 10 { return true; }
                if target_position == 11 { return true; }
                if target_position == 12 { return true; }
                if target_position == 19 { return true; }
                if target_position == 20 { return true; }
                if target_position == 21 { return true; }
                false
            } else {
                // Defender baseline positions: 34,35,36 | 43,44,45 | 52,53,54  
                if target_position == 34 { return true; }
                if target_position == 35 { return true; }
                if target_position == 36 { return true; }
                if target_position == 43 { return true; }
                if target_position == 44 { return true; }
                if target_position == 45 { return true; }
                if target_position == 52 { return true; }
                if target_position == 53 { return true; }
                if target_position == 54 { return true; }
                false
            }
        }

        fn is_position_in_middle(
            self: @ContractState, 
            target_position: u8, 
            is_attacker: bool
        ) -> bool {
            if is_attacker {
                // Attacker middle positions: 5, 14, 23
                if target_position == 5 { return true; }
                if target_position == 14 { return true; }
                if target_position == 23 { return true; }
                false
            } else {
                // Defender middle positions: 32, 41, 50
                if target_position == 32 { return true; }
                if target_position == 41 { return true; }
                if target_position == 50 { return true; }
                false
            }
        }

        fn is_central_position_deployed(
            self: @ContractState,
            battlefield_id: u128,
            zone_id: u8
        ) -> bool {
            let world = self.world_default();
            let battle: BattleField = world.read_model(battlefield_id);
            
            // Get the central position for this zone
            let central_position = if zone_id == 19 {
                5   // Zone 1-9, central position 5
            } else if zone_id == 28 {
                14  // Zone 10-18, central position 14  
            } else if zone_id == 37 {
                23  // Zone 19-27, central position 23
            } else if zone_id == 46 {
                32  // Zone 28-36, central position 32
            } else if zone_id == 55 {
                41  // Zone 37-45, central position 41
            } else if zone_id == 64 {
                50  // Zone 46-54, central position 50
            } else {
                0   // Invalid zone
            };
            
            if central_position == 0 {
                return false; // Invalid zone
            }
            
            // Check if any unit is deployed at the central position
            self.has_any_unit_at_positions(battlefield_id, central_position)
        }

        fn has_any_unit_at_positions(
            self: @ContractState,
            battlefield_id: u128,
            target_position: u8
        ) -> bool {
            let world = self.world_default();
            
            let battlefield_position: BattleFieldPosition = world.read_model((battlefield_id, target_position));
            
            battlefield_position.is_occupied
        }

        fn check_horizontal_neighbors_deployed(
            self: @ContractState,
            battlefield_id: u128,
            target_position: u8
        ) -> bool {
            let grid_position = self.identify_grid_position(target_position);
            
            match grid_position {
                GridPosition::TopLeft => {
                    // For TopLeft, neighbors are: target+1 (right) and target+3 (below)
                    let right_neighbor = target_position + 1;
                    let below_neighbor = target_position + 3;
                    
                    self.has_any_unit_at_positions(battlefield_id, right_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, below_neighbor)
                },
                GridPosition::Top => {
                    // For Top position (like 2, 11, 20, etc.)
                    let left_neighbor = target_position - 1;     // Position 1
                    let right_neighbor = target_position + 1;    // Position 3
                    let diagonal_left = target_position + 2;     // Position 4  
                    let diagonal_right = target_position + 4;    // Position 6
                    // Skip below_neighbor (target + 3) - that's middle, we know it's empty
                    
                    self.has_any_unit_at_positions(battlefield_id, left_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, right_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_left) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_right)
                },
                GridPosition::TopRight => {
                    // For TopRight, neighbors are: target-1 (left) and target+3 (below)
                    let left_neighbor = target_position - 1;
                    let below_neighbor = target_position + 3;
                    
                    self.has_any_unit_at_positions(battlefield_id, left_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, below_neighbor)
                },
                GridPosition::Left => {
                    // For Left position (like 4, 13, 22, etc.)
                    let above_neighbor = target_position - 3;      // Position 1
                    let below_neighbor = target_position + 3;      // Position 7
                    let diagonal_top = target_position - 2;        // Position 2
                    let diagonal_bottom = target_position + 4;     // Position 8
                    // Skip right_neighbor (target + 1) - that's middle, we know it's empty
                    
                    self.has_any_unit_at_positions(battlefield_id, above_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, below_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_top) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_bottom)
                },
                GridPosition::Right => {
                    // For Right position (like 6, 15, 24, etc.)
                    let above_neighbor = target_position - 3;      // Position 3
                    let below_neighbor = target_position + 3;      // Position 9
                    let diagonal_top = target_position - 4;        // Position 2
                    let diagonal_bottom = target_position + 2;     // Position 8
                    // Skip left_neighbor (target - 1) - that's middle, we know it's empty
                    
                    self.has_any_unit_at_positions(battlefield_id, above_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, below_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_top) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_bottom)
                },
                GridPosition::BottomLeft => {
                    // For BottomLeft, neighbors are: target-3 (above) and target+1 (right)
                    let above_neighbor = target_position - 3;
                    let right_neighbor = target_position + 1;
                    
                    self.has_any_unit_at_positions(battlefield_id, above_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, right_neighbor)
                },
                GridPosition::Bottom => {
                    // For Bottom position (like 8, 17, 26, etc.)
                    let left_neighbor = target_position - 1;       // Position 7
                    let right_neighbor = target_position + 1;      // Position 9
                    let diagonal_top_left = target_position - 4;   // Position 4
                    let diagonal_top_right = target_position - 2;  // Position 6
                    // Skip above_neighbor (target - 3) - that's middle, we know it's empty
                    
                    self.has_any_unit_at_positions(battlefield_id, left_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, right_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_top_left) ||
                    self.has_any_unit_at_positions(battlefield_id, diagonal_top_right)
                },
                GridPosition::BottomRight => {
                    // For BottomRight, neighbors are: target-3 (above) and target-1 (left)
                    let above_neighbor = target_position - 3;
                    let left_neighbor = target_position - 1;
                    
                    self.has_any_unit_at_positions(battlefield_id, above_neighbor) ||
                    self.has_any_unit_at_positions(battlefield_id, left_neighbor)
                },
                GridPosition::Middle => {
                    // This shouldn't happen since we know middle is empty, but just in case
                    false
                }
            }
        }

        fn identify_grid_position(self: @ContractState, target_position: u8) -> GridPosition {
            let row = ((target_position - 1) / 3) % 3;  // Which row in the 3x3
            let col = (target_position - 1) % 3;        // Which column in the 3x3
            
            if row == 0 {
                if col == 0 { return GridPosition::TopLeft; }     // Positions 1, 10, 19, 28, 37, 46
                if col == 1 { return GridPosition::Top; }         // Positions 2, 11, 20, 29, 38, 47  
                if col == 2 { return GridPosition::TopRight; }    // Positions 3, 12, 21, 30, 39, 48
            } else if row == 1 {
                if col == 0 { return GridPosition::Left; }        // Positions 4, 13, 22, 31, 40, 49
                if col == 1 { return GridPosition::Middle; }      // Positions 5, 14, 23, 32, 41, 50
                if col == 2 { return GridPosition::Right; }       // Positions 6, 15, 24, 33, 42, 51
            } else if row == 2 {
                if col == 0 { return GridPosition::BottomLeft; }  // Positions 7, 16, 25, 34, 43, 52
                if col == 1 { return GridPosition::Bottom; }      // Positions 8, 17, 26, 35, 44, 53
                if col == 2 { return GridPosition::BottomRight; } // Positions 9, 18, 27, 36, 45, 54
            }
            
            GridPosition::Middle // Default fallback
        }

        fn get_zone_id(self: @ContractState, target_position: u8) -> u8 {
            if target_position >= 1 && target_position <= 9 {
                19  // Zone 1-9 identifier (Northern Front)
            } else if target_position >= 10 && target_position <= 18 {
                28  // Zone 10-18 identifier (Eastern Theater)
            } else if target_position >= 19 && target_position <= 27 {
                37  // Zone 19-27 identifier (Central Command)
            } else if target_position >= 28 && target_position <= 36 {
                46  // Zone 28-36 identifier (Western Flank)
            } else if target_position >= 37 && target_position <= 45 {
                55  // Zone 37-45 identifier (Southern Defense)
            } else if target_position >= 46 && target_position <= 54 {
                64  // Zone 46-54 identifier (Reserve Forces)
            } else {
                0   // Invalid position
            }
        }

        fn get_season(self: @ContractState, count: u64) -> SeasonType {
            if count >= 1 && count <= 8 {
                SeasonType::Odd
            } else if count >= 9 && count <= 16 {
                SeasonType::Even
            } else if count >= 17 && count <= 24 {
               SeasonType::Prime
            }  else {
                SeasonType::None
            }
        }

    }
}