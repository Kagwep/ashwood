use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct BattleField {
    #[key]
    pub battlefield_id: u128,
    pub defender_commander_id: ContractAddress,
    pub invader_commander_id: ContractAddress,
    pub battle_name: felt252,
    pub defender_army_id: u8,
    pub invader_army_id: u8,
    pub defender_score: u8,
    pub invader_score: u8,
    pub status: BattleStatus,
    pub current_turn: u8,
    pub turn_deadline: u64,
    pub season: u64,
    pub created_at: u64,
    pub last_action_type: ActionType,
    pub last_action_timestamp: u64,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct BattleFieldPosition {
    #[key]
    pub battlefield_id: u128,
    #[key]
    pub position: u8,
    pub unit_id: u128,
    pub is_occupied: bool,
    pub owner: ContractAddress,
    pub army_id: u8,
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum GridPosition {
    TopLeft,     // TL
    Top,         // T
    TopRight,    // TR
    Left,        // L
    Middle,      // M
    Right,       // R
    BottomLeft,  // BL
    Bottom,      // B
    BottomRight, // BR
}


#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum BattleStatus {
    Initialized,         // Battle is created but sides haven't deployed.
    WaitingForAttacker,  // Defender is ready, waiting for invader to commit.
    Deploying,           // Both sides are placing units or choosing tactics.
    Strategizing,        // Pre-battle planning phase (e.g., fog of war, traps).
    Engaged,             // Combat is in progress.
    DefenderVictory,     // Home/defending side has won.
    AttackerVictory,     // Away/invading side has won.
    Stalemate,           // Neither side could win (e.g., draw or retreat on both sides).
    Retreat,             // One side has chosen to flee.
    Aborted,             // Match was cancelled or never began (e.g., deserters).
    RevealPending,       // Optional: waiting for commit-reveal confirmation of actions.
}

// Action type enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum ActionType {
    None,
    Attack,
    Retreat,
    Special,
}


// Action type enum
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum SeasonType {
    None,
    Odd,
    Even,
    Prime,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct BattleZone {
    #[key]
    pub battlefield_id: u128,
    #[key]
    pub zone_position_id: u8, // 19, 28, 37, 46, 55, 64 (zone identifiers)
    pub initial_deployment: bool,
    pub has_units: bool,
    pub first_unit_position: u8,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct BattlefieldStats {
    #[key]
    pub battlefield_id: u128,
    // Turn tracking
    pub max_turns: u8,
    pub turns_remaining: u8,
    // Unit counts
    pub invader_units_deployed: u8,
    pub defender_units_deployed: u8,
    pub invader_units_remaining: u8,
    pub defender_units_remaining: u8,
    pub invader_units_eliminated: u8,
    pub defender_units_eliminated: u8,
    pub battle_duration: u64,
    pub invader_retreat: u8,
    pub defender_retreat: u8,
    // Meta information
    pub last_updated: u64,
    pub is_complete: bool,
}

#[generate_trait]
pub impl BattleFieldImpl of BattleFieldTrait {
   #[inline(always)]
   fn new(
       battlefield_id: u128,
       defender_commander_id: ContractAddress,
       invader_commander_id: ContractAddress,
       battle_name: felt252,
       defender_army_id: u8,
       invader_army_id: u8,
       defender_score: u8,
       invader_score: u8,
       current_turn: u8,
       turn_deadline: u64,
       season: u64,
       created_at: u64,
       last_action_timestamp: u64,
   ) -> BattleField {
       BattleField {
           battlefield_id,
           defender_commander_id,
           invader_commander_id,
           battle_name,
           defender_army_id,
           invader_army_id,
           defender_score,
           invader_score,
           status: BattleStatus::WaitingForAttacker,
           current_turn,
           turn_deadline,
           season,
           created_at,
           last_action_type: ActionType::None,
           last_action_timestamp,
       }
   }

   #[inline(always)]
   fn advance_turn(ref self: BattleField) {
       self.current_turn += 1;
   }

   #[inline(always)]
   fn update_status(ref self: BattleField, new_status: BattleStatus) {
       self.status = new_status;
   }

   #[inline(always)]
   fn record_action(ref self: BattleField, action: ActionType, timestamp: u64) {
       self.last_action_type = action;
       self.last_action_timestamp = timestamp;
   }

   #[inline(always)]
   fn update_score(ref self: BattleField, defender_points: u8, invader_points: u8) {
       self.defender_score += defender_points;
       self.invader_score += invader_points;
   }

   #[inline(always)]
   fn is_active(self: BattleField) -> bool {
       match self.status {
           BattleStatus::Deploying | BattleStatus::Strategizing | BattleStatus::Engaged | BattleStatus::Initialized => true,
           _ => false
       }
   }

   #[inline(always)]
   fn is_finished(self: BattleField) -> bool {
       match self.status {
           BattleStatus::DefenderVictory | BattleStatus::AttackerVictory | 
           BattleStatus::Stalemate | BattleStatus::Retreat | BattleStatus::Aborted => true,
           _ => false
       }
   }

   #[inline(always)]
   fn get_winner(self: BattleField) -> Option<ContractAddress> {
       match self.status {
           BattleStatus::DefenderVictory => Option::Some(self.defender_commander_id),
           BattleStatus::AttackerVictory => Option::Some(self.invader_commander_id),
           _ => Option::None
       }
   }

   #[inline(always)]
   fn is_player_turn(self: BattleField, player: ContractAddress) -> bool {
       if self.current_turn % 2 == 0 {
           player == self.defender_commander_id
       } else {
           player == self.invader_commander_id
       }
   }

   #[inline(always)]
   fn extend_deadline(ref self: BattleField, additional_time: u64) {
       self.turn_deadline += additional_time;
   }
}