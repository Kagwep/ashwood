use starknet::ContractAddress;
use ashwood::models::unit::{Unit, UnitClass, UnitTrait};
use ashwood::models::battlefield::{BattleField, BattleFieldTrait, BattleStatus,BattlefieldStats,ActionType,BattleFieldPosition,SeasonType};
use ashwood::models::army::{Army, ArmyUnitPosition,ArmyUnitPositionTrait, ArmyUnitUsed};

#[starknet::interface]
pub trait IActions<T> {
    // Movement actions
    fn move_unit(
        ref self: T,
        battlefield_id: u128,
        army_id: u8,
        unit_id: u128,
        from_position: u8,
        to_position: u8
    );
    
    // Attack actions
    fn attack_unit(
        ref self: T,
        battlefield_id: u128,
        attacker_unit_id: u128,
        target_unit_id: u128
    ) ;
    
    // Retreat actions
    fn retreat_unit(
        ref self: T,
        battlefield_id: u128,
        army_id: u8,
        unit_id: u128
    ) ;
    

}

#[dojo::contract]
pub mod actions {
    use super::{IActions, Unit, UnitClass, UnitTrait, BattleField, BattleFieldTrait,BattleFieldPosition, 
                Army, ArmyUnitPosition,ArmyUnitPositionTrait, ArmyUnitUsed, SeasonType,BattlefieldStats,BattleStatus,ActionType};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    use ashwood::constants::{MAX_BATTLE_TURNS,MAX_DEPLOYABLE_UNITS};

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitMoved {
        #[key]
        pub battlefield_id: u128,
        pub unit_id: u128,
        pub from_position: u8,
        pub to_position: u8,
        pub player: ContractAddress,
        pub turn: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitAttacked {
        #[key]
        pub battlefield_id: u128,
        pub attacker_unit_id: u128,
        pub target_unit_id: u128,
        pub damage_dealt: u8,
        pub turn: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct UnitDeployed {
        #[key]
        pub battlefield_id: u128,
        pub unit_id: u128,
        pub position: u8,
        pub player: ContractAddress,
        pub army_id: u8,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn move_unit(
            ref self: ContractState,
            battlefield_id: u128,
            army_id: u8,
            unit_id: u128,
            from_position: u8,
            to_position: u8
        )  {
            let mut world = self.world_default();
            let player = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Validate battle state and player turn
            let mut battle: BattleField = world.read_model(battlefield_id);
            assert(battle.is_active(), 'Battle not active');
            assert(battle.is_player_turn(player), 'Not your turn');

            let mut battlefield_stats:BattlefieldStats = world.read_model(battlefield_id);

            assert(battlefield_stats.turns_remaining <= 120 , 'Game Ended');

            let is_cross_border = self.is_cross_border(from_position,to_position);

            if is_cross_border {
                // Validate cross-border specific rules
                let cross_border_validity = self.validate_cross_border_movement(battlefield_id, unit_id, from_position, to_position, player);
                assert(cross_border_validity, 'Invalid Cross Move');
            } else {
                // Validate normal movement
                let movement_validity = self.validate_movement(battlefield_id, unit_id, from_position, to_position, player);
                assert(movement_validity, 'Invalid Move');
            }
            
            let season: SeasonType  = self.get_season(battle.season);

            let position_and_season = self.validate_position_for_season(to_position,season);

            assert(position_and_season, 'Not Season');
            
            let unit: Unit = world.read_model(unit_id);

                        // Check if unit is already deployed
            let mut existing_unit_position: ArmyUnitPosition = world.read_model((player, army_id, unit_id));

                        // update the  battfiled position 
            let mut to_deploy_position: BattleFieldPosition = world.read_model((battlefield_id, to_position));
            let mut to_deploy_from_position: BattleFieldPosition = world.read_model((battlefield_id, from_position));

            assert(to_deploy_from_position.owner == player, 'Not Your Unit');
            
            
            existing_unit_position.update_position(to_position);



            if to_deploy_position.army_id == 0 {
              world.write_model(
                @BattleFieldPosition {
                battlefield_id,
                position: to_position,
                unit_id,
                is_occupied: true,
                owner: player,
                army_id: army_id,
                }
            );

            }else{
                to_deploy_position.unit_id = unit_id;
                to_deploy_position.is_occupied = true;
                to_deploy_position.owner = player;
                to_deploy_position.army_id = army_id;

                world.write_model(@to_deploy_position);
            }

            to_deploy_from_position.unit_id = 0;
            to_deploy_from_position.is_occupied = false;
            to_deploy_from_position.owner = player;
            to_deploy_from_position.army_id = army_id;

            battlefield_stats.turns_remaining -= 1;
            battlefield_stats.last_updated = timestamp;

            world.write_model(@battlefield_stats);

            // impliment validate supply - needed?
            
            world.write_model(@to_deploy_from_position);

             battle.advance_turn();

            battle.status = BattleStatus::Strategizing;

            battle.season += 1;

            if battle.season > 24 {
                battle.season = 1;
            }


            world.write_model(@battle);

            world.write_model(@existing_unit_position);

            //
 
         }

        
        fn attack_unit(
            ref self: ContractState,
            battlefield_id: u128,
            attacker_unit_id: u128,
            target_unit_id: u128
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Validate battle state
            let mut battle: BattleField = world.read_model(battlefield_id);
            assert(battle.is_active(), 'Battle not active');
            assert(battle.is_player_turn(player), 'Not your turn');

            let mut battlefield_stats:BattlefieldStats = world.read_model(battlefield_id);

            assert(battlefield_stats.turns_remaining <= 120 , 'Game Ended');
            
            // Determine which army the current player controls
            let (player_army_id, opponent_army_id) = if player == battle.invader_commander_id {
                (battle.invader_army_id, battle.defender_army_id)
            } else {
                (battle.defender_army_id, battle.invader_army_id)
            };
            
            let opponent_commander = if player == battle.invader_commander_id {
                battle.defender_commander_id
            } else {
                battle.invader_commander_id
            };
            
            // Get unit positions - the attacker must belong to current player's army
            let mut attacking_unit_position: ArmyUnitPosition = world.read_model((player, player_army_id, attacker_unit_id));

            let mut attacking_position: BattleFieldPosition = world.read_model((battlefield_id, attacking_unit_position.position_index));

            assert(attacking_position.owner == player, 'Not Your Unit');
            
            // The target unit belongs to the opponent's army
            let mut target_unit_position: ArmyUnitPosition = world.read_model((opponent_commander, opponent_army_id, target_unit_id));

            let season: SeasonType  = self.get_season(battle.season);
            
            // Validate season for the target position
            let position_and_season = self.validate_position_for_season(target_unit_position.position_index, season);
            assert(position_and_season, 'Not Season');

            let is_cross_border = self.is_cross_border(attacking_unit_position.position_index, target_unit_position.position_index);

            if is_cross_border {
                // Validate cross-border attack
                let cross_border_attack_validity = self.validate_cross_border_attack(battlefield_id, attacker_unit_id, attacking_unit_position.position_index, target_unit_position.position_index, player);
                assert(cross_border_attack_validity, 'Invalid Cross Attack');
            } else {
                // Validate normal attack
                let attack_validity = self.validate_attack_movement(battlefield_id, attacker_unit_id, attacking_unit_position.position_index, target_unit_position.position_index, player);
                assert(attack_validity, 'Invalid Attack');
            }
        
            
            // Get unit stats
            let attacker_unit: Unit = world.read_model(attacker_unit_id);
            let defender_unit: Unit = world.read_model(target_unit_id);
            
            // Apply seasonal effects
            let (attacker_attack_mod, attacker_defense_mod, attacker_speed_mod, attacker_special_mod) = 
                self.apply_seasonal_effects(attacker_unit, season);
            let (defender_attack_mod, defender_defense_mod, defender_speed_mod, defender_special_mod) = 
                self.apply_seasonal_effects(defender_unit, season);
            
            // Attacker's effectiveness = attack power + speed (for first strike) + special abilities
            let attacker_score = attacker_attack_mod + attacker_speed_mod + attacker_special_mod;

            // Defender's effectiveness = defense + speed (for counter-attack) + special abilities  
            let defender_score = defender_defense_mod + defender_speed_mod + defender_special_mod;
                        
            // Determine outcome and update battle state
            if attacker_score > defender_score {
                // Attacker wins - defender unit is eliminated
                if player == battle.invader_commander_id {
                    battle.invader_score += 1;
                    battlefield_stats.defender_units_eliminated += 1;
                } else {
                    battle.defender_score += 1;
                    battlefield_stats.invader_units_eliminated += 1;
                }
                
                // Mark the defending unit as used/eliminated
                world.write_model(
                    @ArmyUnitUsed {
                        commander_id: opponent_commander,
                        army_id: opponent_army_id,
                        battlefield_id: battlefield_id,
                        unit_id: target_unit_id,
                        turn: battle.current_turn,
                    }
                );
                
                // Attacker wins, so they keep the turn (can attack again)
                
            } else if defender_score > attacker_score {
                // Defender wins - attacker unit is eliminated
                if player == battle.invader_commander_id {
                    battle.defender_score += 1;
                    battlefield_stats.invader_units_eliminated += 1;
                } else {
                    battle.invader_score += 1;
                    battlefield_stats.defender_units_eliminated += 1;
                }
                
                // Mark the attacking unit as used/eliminated
                world.write_model(
                    @ArmyUnitUsed {
                        commander_id: player,
                        army_id: player_army_id,
                        battlefield_id: battlefield_id,
                        unit_id: attacker_unit_id,
                        turn: battle.current_turn,
                    }
                );
                
                // Attacker loses, turn advances
                battle.current_turn += 1;
                battlefield_stats.turns_remaining -= 1;

            } else {
                // Tie - both units are eliminated
                world.write_model(
                    @ArmyUnitUsed {
                        commander_id: player,
                        army_id: player_army_id,
                        battlefield_id: battlefield_id,
                        unit_id: attacker_unit_id,
                        turn: battle.current_turn,
                    }
                );
                
                world.write_model(
                    @ArmyUnitUsed {
                        commander_id: opponent_commander,
                        army_id: opponent_army_id,
                        battlefield_id: battlefield_id,
                        unit_id: target_unit_id,
                        turn: battle.current_turn,
                    }
                );
                
                // Both eliminated, turn advances
                battle.current_turn += 1;
                battlefield_stats.turns_remaining -= 1;
            }


            if battle.current_turn >= 120 {
                // Turn limit reached - determine winner by score
                if battle.invader_score > battle.defender_score {
                    battle.status = BattleStatus::AttackerVictory;
                } else if battle.defender_score > battle.invader_score {
                    battle.status = BattleStatus::DefenderVictory;
                } else {
                    battle.status = BattleStatus::Stalemate;
                }
                battlefield_stats.is_complete = true;
            } else {
                // Check for elimination victory
                if battlefield_stats.invader_units_remaining == 0 && battlefield_stats.defender_units_remaining == 0 {
                    battle.status = BattleStatus::Stalemate;
                    battlefield_stats.is_complete = true;
                } else if battlefield_stats.invader_units_remaining == 0 {
                    battle.status = BattleStatus::DefenderVictory;
                    battlefield_stats.is_complete = true;
                } else if battlefield_stats.defender_units_remaining == 0 {
                    battle.status = BattleStatus::AttackerVictory;
                    battlefield_stats.is_complete = true;
                }
            }
                        
            // Update battle state
            battle.last_action_type = ActionType::Attack;
            battle.last_action_timestamp = timestamp;
            
            battlefield_stats.last_updated = timestamp;

            world.write_model(@battlefield_stats);

            battle.season += 1;

            if battle.season > 24 {
                battle.season = 1;
            }

            // Write updated battle state
            world.write_model(@battle);
        }

        fn retreat_unit(
            ref self: ContractState,
            battlefield_id: u128,
            army_id: u8,
            unit_id: u128
        ) {
            let mut world = self.world_default();
            let player = get_caller_address();
            let timestamp = get_block_timestamp();
            
            // Validate battle state
            let mut battle: BattleField = world.read_model(battlefield_id);
            assert(battle.is_active(), 'Battle not active');
            assert(battle.is_player_turn(player), 'Not your turn');
            let mut battlefield_stats: BattlefieldStats = world.read_model(battlefield_id);
            assert(battlefield_stats.turns_remaining > 0, 'Game Ended');

            let mut  unit_position: ArmyUnitPosition = world.read_model((player, army_id, unit_id));
            let mut retreating_position: BattleFieldPosition = world.read_model((battlefield_id, unit_position.position_index));

            assert(retreating_position.owner == player, 'Not Your Unit');
            
            // Determine which side is retreating
            let player_army_id = if player == battle.invader_commander_id {
                battle.invader_army_id
            } else {
                battle.defender_army_id
            };
            
            // Validate the unit belongs to the retreating player
            assert(army_id == player_army_id, 'Not your unit');
            
            // Mark unit as eliminated/used
            world.write_model(
                @ArmyUnitUsed {
                    commander_id: player,
                    army_id: army_id,
                    battlefield_id: battlefield_id,
                    unit_id: unit_id,
                    turn: battle.current_turn,
                }
            );
            
            // RETREAT = IMMEDIATE LOSS - Game ends with retreating player losing
            if player == battle.invader_commander_id {
                battle.status = BattleStatus::DefenderVictory; // Invader retreats = Defender wins
                battlefield_stats.invader_retreat += 1;
            } else {
                battle.status = BattleStatus::AttackerVictory; // Defender retreats = Attacker wins
                battlefield_stats.defender_retreat += 1;
            }
            
            // Update final battle state
            battle.last_action_type = ActionType::Retreat;
            battle.last_action_timestamp = timestamp;
            battlefield_stats.is_complete = true;
            battlefield_stats.battle_duration = timestamp - battle.created_at;
            
            
            // Write final state
            world.write_model(@battle);
            world.write_model(@battlefield_stats);
        }


    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"ashwood")
        }

        fn validate_movement(
            self: @ContractState,
            battlefield_id: u128,
            unit_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            let world = self.world_default();
            
            // Get unit to check its class
            let unit: Unit = world.read_model(unit_id);
            if unit.id == 0 {
                return false; // Unit doesn't exist
            }
            
            // Check if destination is occupied
            let destination: BattleFieldPosition = world.read_model((battlefield_id, to_position));
            if destination.is_occupied {
                return false; // Destination occupied
            }
            
            // Validate movement based on unit class
            match unit.unit_class {
                UnitClass::Infantry => self.validate_infantry_movement(from_position, to_position),
                UnitClass::Pike => self.validate_pike_movement( battlefield_id,from_position, to_position,player),
                UnitClass::Archer => self.validate_archer_movement(from_position, to_position),
                UnitClass::Cavalry => self.validate_cavalry_movement(battlefield_id, from_position, to_position),
                UnitClass::Elite => self.validate_elite_movement(from_position, to_position),
                UnitClass::Support => self.validate_support_movement(from_position, to_position),
            }
        }

        fn validate_attack_movement(
            self: @ContractState,
            battlefield_id: u128,
            unit_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            let world = self.world_default();
            
            // Get unit to check its class
            let unit: Unit = world.read_model(unit_id);
            if unit.id == 0 {
                return false; // Unit doesn't exist
            }
            
            // Check if destination is occupied (REQUIRED for attacks)
            let destination: BattleFieldPosition = world.read_model((battlefield_id, to_position));
            if !destination.is_occupied {
                return false; // No target to attack
            }
            
            // Validate attack range based on unit class
          match unit.unit_class {
                UnitClass::Infantry => self.validate_infantry_movement(from_position, to_position),
                UnitClass::Pike => self.validate_pike_movement( battlefield_id,from_position, to_position,player),
                UnitClass::Archer => self.validate_archer_movement(from_position, to_position),
                UnitClass::Cavalry => self.validate_cavalry_movement(battlefield_id, from_position, to_position),
                UnitClass::Elite => self.validate_elite_movement(from_position, to_position),
                UnitClass::Support => self.validate_support_movement(from_position, to_position),
            }
        }

        fn validate_infantry_movement(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> bool {
            // Infantry: 1 tile orthogonal only
            let distance = self.calculate_orthogonal_distance(from_position, to_position);
            distance == 1
        }

        fn validate_pike_movement(
            self: @ContractState,
            battlefield_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            // Pike: 1 tile forward only (toward enemy baseline)
            // For attackers: "forward" means higher position numbers
            // For defenders: "forward" means lower position numbers
            
            return self.validate_pike_forward_movement(battlefield_id, from_position, to_position, player);
        }

        fn validate_pike_forward_movement(
            self: @ContractState,
            battlefield_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            let world = self.world_default();
            let battle: BattleField = world.read_model(battlefield_id);
            
            // Determine if player is attacker or defender
            let is_attacker = player != battle.defender_commander_id;
            
            // Check if movement is exactly 1 tile orthogonal first
            let distance = self.calculate_orthogonal_distance(from_position, to_position);
            if distance != 1 {
                return false; // Pike can only move 1 tile
            }
            
            // Check forward direction based on player type
            if is_attacker {
                // Attacker moves "forward" = higher position numbers
                to_position > from_position
            } else {
                // Defender moves "forward" = lower position numbers  
                to_position < from_position
            }
        }
        fn validate_archer_movement(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> bool {
            // Archer: 1 tile orthogonal only
            let distance = self.calculate_orthogonal_distance(from_position, to_position);
            distance == 1
        }

        fn validate_cavalry_movement(
            self: @ContractState,
            battlefield_id: u128,
            from_position: u8,
            to_position: u8
        ) -> bool {
            // Cavalry: Exactly 2 tiles orthogonal, no jumping over units
            let distance = self.calculate_orthogonal_distance(from_position, to_position);
            if distance != 2 {
                return false;
            }
            
            // Check no units in between (no jumping)
            let middle_position = self.get_middle_position(from_position, to_position);
            if middle_position > 0 {
                let world = self.world_default();
                let middle: BattleFieldPosition = world.read_model((battlefield_id, middle_position));
                if middle.is_occupied {
                    return false; // Cannot jump over units
                }
            }
            
            true
        }

        fn validate_elite_movement(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> bool {
            // Elite: 1 or 2 tiles in any direction (orthogonal + diagonal)
            let orthogonal_distance = self.calculate_orthogonal_distance(from_position, to_position);
            let diagonal_distance = self.calculate_diagonal_distance(from_position, to_position);
            
            // Can move 1 or 2 tiles in any direction
            (orthogonal_distance >= 1 && orthogonal_distance <= 2) || 
            (diagonal_distance >= 1 && diagonal_distance <= 2)
        }

        fn validate_support_movement(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> bool {
            // Support: 1 tile in any direction (orthogonal + diagonal)
            let orthogonal_distance = self.calculate_orthogonal_distance(from_position, to_position);
            let diagonal_distance = self.calculate_diagonal_distance(from_position, to_position);
            
            orthogonal_distance == 1 || diagonal_distance == 1
        }

        fn calculate_orthogonal_distance(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> u8 {
            // Check if movement is purely orthogonal (same row or column within grid)
            let from_grid = (from_position - 1) / 9;
            let to_grid = (to_position - 1) / 9;
            
            if from_grid != to_grid {
                return 255; // Different grids, not orthogonal
            }
            
            let from_local = (from_position - 1) % 9;
            let to_local = (to_position - 1) % 9;
            
            let from_row = from_local / 3;
            let from_col = from_local % 3;
            let to_row = to_local / 3;
            let to_col = to_local % 3;
            
            // Check if same row or same column
            if from_row == to_row {
                // Same row - horizontal movement
                if from_col > to_col { from_col - to_col } else { to_col - from_col }
            } else if from_col == to_col {
                // Same column - vertical movement
                if from_row > to_row { from_row - to_row } else { to_row - from_row }
            } else {
                255 // Not orthogonal
            }
        }

        fn calculate_diagonal_distance(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> u8 {
            // Check diagonal movement within same grid
            let from_grid = (from_position - 1) / 9;
            let to_grid = (to_position - 1) / 9;
            
            if from_grid != to_grid {
                return 255; // Different grids
            }
            
            let from_local = (from_position - 1) % 9;
            let to_local = (to_position - 1) % 9;
            
            let from_row = from_local / 3;
            let from_col = from_local % 3;
            let to_row = to_local / 3;
            let to_col = to_local % 3;
            
            let row_diff = if from_row > to_row { from_row - to_row } else { to_row - from_row };
            let col_diff = if from_col > to_col { from_col - to_col } else { to_col - from_col };
            
            // Diagonal movement: row and column differences should be equal
            if row_diff == col_diff && row_diff > 0 {
                row_diff
            } else {
                255 // Not diagonal
            }
        }

        fn get_middle_position(
            self: @ContractState,
            from_position: u8,
            to_position: u8
        ) -> u8 {
            // For cavalry 2-tile movement, get the middle position
            // Only works for orthogonal movement
            let distance = self.calculate_orthogonal_distance(from_position, to_position);
            if distance != 2 {
                return 0; // No middle position
            }
            
            // Calculate middle position for 2-tile orthogonal movement
            if from_position < to_position {
                from_position + 1
            } else {
                from_position - 1
            }
        }




        fn apply_seasonal_effects(
            self: @ContractState,
            unit: Unit,
            season: SeasonType
        ) -> (u8, u8, u8, u8) {
            let (attack_mod, defense_mod, speed_mod, special_mod) = match (unit.unit_class, season) {
                // ❄️ WINTER (Odd) Effects
                (UnitClass::Infantry, SeasonType::Odd) => (0, 1, 2, 0), // defense -1, speed -2
                (UnitClass::Pike, SeasonType::Odd) => (11, 12, 0, 0), // attack +1, defense +2
                (UnitClass::Archer, SeasonType::Odd) => (1, 0, 0, 1), // attack -1, special -1
                (UnitClass::Cavalry, SeasonType::Odd) => (1, 0, 3, 0), // attack -1, speed -3
                (UnitClass::Elite, SeasonType::Odd) => (12, 1, 0, 0), // attack +2, defense -1
                (UnitClass::Support, SeasonType::Odd) => (0, 11, 0, 11), // defense +1, special +1
                
                // ☀️ SUMMER (Even) Effects  
                (UnitClass::Infantry, SeasonType::Even) => (0, 0, 11, 0), // speed +1
                (UnitClass::Pike, SeasonType::Even) => (13, 0, 0, 0), // attack +3
                (UnitClass::Archer, SeasonType::Even) => (13, 0, 0, 11), // attack +3, special +1
                (UnitClass::Cavalry, SeasonType::Even) => (11, 0, 12, 0), // attack +1, speed +2
                (UnitClass::Elite, SeasonType::Even) => (11, 11, 11, 11), // all +1
                (UnitClass::Support, SeasonType::Even) => (0, 0, 0, 1), // special -1
                
                // 🍂 AUTUMN (Prime) Effects
                (UnitClass::Infantry, SeasonType::Prime) => (0, 11, 0, 0), // defense +1
                (UnitClass::Pike, SeasonType::Prime) => (0, 0, 1, 0), // speed -1
                (UnitClass::Archer, SeasonType::Prime) => (11, 0, 0, 0), // attack +1
                (UnitClass::Cavalry, SeasonType::Prime) => (1, 0, 2, 0), // attack -1, speed -2
                (UnitClass::Elite, SeasonType::Prime) => (0, 0, 0, 12), // special +2
                (UnitClass::Support, SeasonType::Prime) => (0, 0, 11, 0), // speed +1
                
                (_, SeasonType::None) => (0, 0, 0, 0), // No changes
            };
            
            let modified_attack = self.apply_modifier(unit.attack, attack_mod);
            let modified_defense = self.apply_modifier(unit.defense, defense_mod);
            let modified_speed = self.apply_modifier(unit.speed, speed_mod);
            let modified_special = self.apply_modifier(unit.special, special_mod);
            
            (modified_attack, modified_defense, modified_speed, modified_special)
        }

        fn apply_modifier(self: @ContractState,base_stat: u8, modifier: u8) -> u8 {
            if modifier >= 10 {
                // Bonus: add (modifier - 10)
                base_stat + (modifier - 10)
            } else {
                // Reduction: subtract modifier, minimum 0
                if base_stat > modifier {
                    base_stat - modifier
                } else {
                    0
                }
            }
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
                _ => false

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
        fn is_cross_border(
                self: @ContractState,
                from_position: u8,
                to_position: u8
            ) -> bool {
                self.is_border_1_to_10(from_position, to_position) ||
                self.is_border_10_to_19(from_position, to_position) ||
                self.is_border_1_to_28(from_position, to_position) ||
                self.is_border_10_to_37(from_position, to_position) ||
                self.is_border_19_to_46(from_position, to_position) ||
                self.is_border_28_to_37(from_position, to_position) ||
                self.is_border_37_to_46(from_position, to_position)
            }

            fn is_border_1_to_10(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 3 && to == 10) || (from == 10 && to == 3) ||
                (from == 6 && to == 13) || (from == 13 && to == 6) ||
                (from == 9 && to == 16) || (from == 16 && to == 9)
            }

            fn is_border_10_to_19(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 12 && to == 19) || (from == 19 && to == 12) ||
                (from == 15 && to == 22) || (from == 22 && to == 15) ||
                (from == 18 && to == 25) || (from == 25 && to == 18)
            }

            fn is_border_1_to_28(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 7 && to == 28) || (from == 28 && to == 7) ||
                (from == 8 && to == 29) || (from == 29 && to == 8) ||
                (from == 9 && to == 30) || (from == 30 && to == 9)
            }

            fn is_border_10_to_37(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 16 && to == 37) || (from == 37 && to == 16) ||
                (from == 17 && to == 38) || (from == 38 && to == 17) ||
                (from == 18 && to == 39) || (from == 39 && to == 18)
            }

            fn is_border_19_to_46(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 25 && to == 46) || (from == 46 && to == 25) ||
                (from == 26 && to == 47) || (from == 47 && to == 26) ||
                (from == 27 && to == 48) || (from == 48 && to == 27)
            }

            fn is_border_28_to_37(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 30 && to == 37) || (from == 37 && to == 30) ||
                (from == 33 && to == 40) || (from == 40 && to == 33) ||
                (from == 36 && to == 43) || (from == 43 && to == 36)
            }

            fn is_border_37_to_46(self: @ContractState, from: u8, to: u8) -> bool {
                (from == 39 && to == 46) || (from == 46 && to == 39) ||
                (from == 42 && to == 49) || (from == 49 && to == 42) ||
                (from == 45 && to == 52) || (from == 52 && to == 45)
            }
        fn validate_cross_border_movement(
            self: @ContractState,
            battlefield_id: u128,
            unit_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            let world = self.world_default();
            
            // 1. Check unit exists
            let unit: Unit = world.read_model(unit_id);
            if unit.id == 0 {
                return false;
            }
            
            // 2. Check destination is not occupied
            let destination: BattleFieldPosition = world.read_model((battlefield_id, to_position));
            if destination.is_occupied {
                return false;
            }
            
            // 3. Verify it's a valid cross-border pair
            if !self.is_cross_border(from_position, to_position) {
                return false;
            }
            
            // 4. Unit-specific cross-border rules
            match unit.unit_class {
                UnitClass::Pike => true,
                UnitClass::Infantry => true,  // Can cross freely
                UnitClass::Archer => true,   // Can cross freely  
                UnitClass::Cavalry => true,  // Can cross freely (but only 1 tile, not 2)
                UnitClass::Elite => true,    // Can cross freely
                UnitClass::Support => true,  // Can cross freely
            }
        }
        fn validate_cross_border_attack(
            self: @ContractState,
            battlefield_id: u128,
            unit_id: u128,
            from_position: u8,
            to_position: u8,
            player: ContractAddress
        ) -> bool {
            let world = self.world_default();
            
            // 1. Check unit exists
            let unit: Unit = world.read_model(unit_id);
            if unit.id == 0 {
                return false;
            }
            
            // 2. Check destination is not occupied
            let destination: BattleFieldPosition = world.read_model((battlefield_id, to_position));
            if !destination.is_occupied {
                return false;
            }
            
            // 3. Verify it's a valid cross-border pair
            if !self.is_cross_border(from_position, to_position) {
                return false;
            }
            
            // 4. Unit-specific cross-border rules
            match unit.unit_class {
                UnitClass::Pike => true,
                UnitClass::Infantry => true,  // Can cross freely
                UnitClass::Archer => true,   // Can cross freely  
                UnitClass::Cavalry => true,  // Can cross freely (but only 1 tile, not 2)
                UnitClass::Elite => true,    // Can cross freely
                UnitClass::Support => true,  // Can cross freely
            }
        }
    }
}