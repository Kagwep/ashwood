import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, type BigNumberish } from 'starknet';

// Type definition for `ashwood::models::army::Army` struct
export interface Army {
	commander_id: string;
	army_id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `ashwood::models::army::ArmyUnitPosition` struct
export interface ArmyUnitPosition {
	commander_id: string;
	army_id: BigNumberish;
	unit_id: BigNumberish;
	position_index: BigNumberish;
	battlefield_id: BigNumberish;
}

// Type definition for `ashwood::models::army::ArmyUnitPositionValue` struct
export interface ArmyUnitPositionValue {
	position_index: BigNumberish;
	battlefield_id: BigNumberish;
}

// Type definition for `ashwood::models::army::ArmyUnitUsed` struct
export interface ArmyUnitUsed {
	commander_id: string;
	army_id: BigNumberish;
	battlefield_id: BigNumberish;
	unit_id: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::models::army::ArmyUnitUsedValue` struct
export interface ArmyUnitUsedValue {
	turn: BigNumberish;
}

// Type definition for `ashwood::models::army::ArmyValue` struct
export interface ArmyValue {
	name: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleField` struct
export interface BattleField {
	battlefield_id: BigNumberish;
	defender_commander_id: string;
	invader_commander_id: string;
	battle_name: BigNumberish;
	defender_army_id: BigNumberish;
	invader_army_id: BigNumberish;
	defender_score: BigNumberish;
	invader_score: BigNumberish;
	status: BattleStatusEnum;
	current_turn: BigNumberish;
	turn_deadline: BigNumberish;
	season: BigNumberish;
	created_at: BigNumberish;
	last_action_type: ActionTypeEnum;
	last_action_timestamp: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleFieldPosition` struct
export interface BattleFieldPosition {
	battlefield_id: BigNumberish;
	position: BigNumberish;
	unit_id: BigNumberish;
	is_occupied: boolean;
	owner: string;
	army_id: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleFieldPositionValue` struct
export interface BattleFieldPositionValue {
	unit_id: BigNumberish;
	is_occupied: boolean;
	owner: string;
	army_id: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleFieldValue` struct
export interface BattleFieldValue {
	defender_commander_id: string;
	invader_commander_id: string;
	battle_name: BigNumberish;
	defender_army_id: BigNumberish;
	invader_army_id: BigNumberish;
	defender_score: BigNumberish;
	invader_score: BigNumberish;
	status: BattleStatusEnum;
	current_turn: BigNumberish;
	turn_deadline: BigNumberish;
	season: BigNumberish;
	created_at: BigNumberish;
	last_action_type: ActionTypeEnum;
	last_action_timestamp: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleZone` struct
export interface BattleZone {
	battlefield_id: BigNumberish;
	zone_position_id: BigNumberish;
	initial_deployment: boolean;
	has_units: boolean;
	first_unit_position: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattleZoneValue` struct
export interface BattleZoneValue {
	initial_deployment: boolean;
	has_units: boolean;
	first_unit_position: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::BattlefieldStats` struct
export interface BattlefieldStats {
	battlefield_id: BigNumberish;
	max_turns: BigNumberish;
	turns_remaining: BigNumberish;
	invader_units_deployed: BigNumberish;
	defender_units_deployed: BigNumberish;
	invader_units_remaining: BigNumberish;
	defender_units_remaining: BigNumberish;
	invader_units_eliminated: BigNumberish;
	defender_units_eliminated: BigNumberish;
	battle_duration: BigNumberish;
	invader_retreat: BigNumberish;
	defender_retreat: BigNumberish;
	last_updated: BigNumberish;
	is_complete: boolean;
}

// Type definition for `ashwood::models::battlefield::BattlefieldStatsValue` struct
export interface BattlefieldStatsValue {
	max_turns: BigNumberish;
	turns_remaining: BigNumberish;
	invader_units_deployed: BigNumberish;
	defender_units_deployed: BigNumberish;
	invader_units_remaining: BigNumberish;
	defender_units_remaining: BigNumberish;
	invader_units_eliminated: BigNumberish;
	defender_units_eliminated: BigNumberish;
	battle_duration: BigNumberish;
	invader_retreat: BigNumberish;
	defender_retreat: BigNumberish;
	last_updated: BigNumberish;
	is_complete: boolean;
}

// Type definition for `ashwood::models::unit::Unit` struct
export interface Unit {
	id: BigNumberish;
	player_name: BigNumberish;
	unit_class: UnitClassEnum;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	special: BigNumberish;
}

// Type definition for `ashwood::models::unit::UnitValue` struct
export interface UnitValue {
	player_name: BigNumberish;
	unit_class: UnitClassEnum;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	special: BigNumberish;
}

// Type definition for `ashwood::systems::actions::actions::UnitAttacked` struct
export interface UnitAttacked {
	battlefield_id: BigNumberish;
	attacker_unit_id: BigNumberish;
	target_unit_id: BigNumberish;
	damage_dealt: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::actions::actions::UnitAttackedValue` struct
export interface UnitAttackedValue {
	attacker_unit_id: BigNumberish;
	target_unit_id: BigNumberish;
	damage_dealt: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::actions::actions::UnitDeployed` struct
export interface UnitDeployed {
	battlefield_id: BigNumberish;
	unit_id: BigNumberish;
	position: BigNumberish;
	player: string;
	army_id: BigNumberish;
}

// Type definition for `ashwood::systems::actions::actions::UnitDeployedValue` struct
export interface UnitDeployedValue {
	unit_id: BigNumberish;
	position: BigNumberish;
	player: string;
	army_id: BigNumberish;
}

// Type definition for `ashwood::systems::armies::armies::ArmyCreated` struct
export interface ArmyCreated {
	commander_id: string;
	army_id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `ashwood::systems::armies::armies::ArmyCreatedValue` struct
export interface ArmyCreatedValue {
	army_id: BigNumberish;
	name: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::BattleCreated` struct
export interface BattleCreated {
	battlefield_id: BigNumberish;
	defender: string;
	invader: string;
	defender_army_id: BigNumberish;
	invader_army_id: BigNumberish;
	created_at: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::BattleCreatedValue` struct
export interface BattleCreatedValue {
	defender: string;
	invader: string;
	defender_army_id: BigNumberish;
	invader_army_id: BigNumberish;
	created_at: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitDeployedToBattle` struct
export interface UnitDeployedToBattle {
	battlefield_id: BigNumberish;
	army_id: BigNumberish;
	unit_id: BigNumberish;
	global_position: BigNumberish;
	owner: string;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitDeployedToBattleValue` struct
export interface UnitDeployedToBattleValue {
	army_id: BigNumberish;
	unit_id: BigNumberish;
	global_position: BigNumberish;
	owner: string;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitEngagement` struct
export interface UnitEngagement {
	battlefield_id: BigNumberish;
	attacker_army_id: BigNumberish;
	attacker_unit_id: BigNumberish;
	target_unit_id: BigNumberish;
	damage_dealt: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitEngagementValue` struct
export interface UnitEngagementValue {
	attacker_army_id: BigNumberish;
	attacker_unit_id: BigNumberish;
	target_unit_id: BigNumberish;
	damage_dealt: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitMoved` struct
export interface UnitMoved {
	battlefield_id: BigNumberish;
	army_id: BigNumberish;
	unit_id: BigNumberish;
	from_position: BigNumberish;
	to_position: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::battlefields::battlefields::UnitMovedValue` struct
export interface UnitMovedValue {
	army_id: BigNumberish;
	unit_id: BigNumberish;
	from_position: BigNumberish;
	to_position: BigNumberish;
	turn: BigNumberish;
}

// Type definition for `ashwood::systems::units::units::CombatCalculated` struct
export interface CombatCalculated {
	attacker_id: BigNumberish;
	target_id: BigNumberish;
	damage: BigNumberish;
	has_advantage: boolean;
}

// Type definition for `ashwood::systems::units::units::CombatCalculatedValue` struct
export interface CombatCalculatedValue {
	target_id: BigNumberish;
	damage: BigNumberish;
	has_advantage: boolean;
}

// Type definition for `ashwood::systems::units::units::UnitCreated` struct
export interface UnitCreated {
	player: string;
	id: BigNumberish;
	player_name: BigNumberish;
	unit_class: UnitClassEnum;
}

// Type definition for `ashwood::systems::units::units::UnitCreatedValue` struct
export interface UnitCreatedValue {
	id: BigNumberish;
	player_name: BigNumberish;
	unit_class: UnitClassEnum;
}

// Type definition for `ashwood::systems::units::units::UnitStatsUpdated` struct
export interface UnitStatsUpdated {
	player: string;
	id: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	special: BigNumberish;
}

// Type definition for `ashwood::systems::units::units::UnitStatsUpdatedValue` struct
export interface UnitStatsUpdatedValue {
	id: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	special: BigNumberish;
}

// Type definition for `ashwood::models::battlefield::ActionType` enum
export const actionType = [
	'None',
	'Attack',
	'Retreat',
	'Special',
] as const;
export type ActionType = { [key in typeof actionType[number]]: string };
export type ActionTypeEnum = CairoCustomEnum;

// Type definition for `ashwood::models::battlefield::BattleStatus` enum
export const battleStatus = [
	'Initialized',
	'WaitingForAttacker',
	'Deploying',
	'Strategizing',
	'Engaged',
	'DefenderVictory',
	'AttackerVictory',
	'Stalemate',
	'Retreat',
	'Aborted',
	'RevealPending',
] as const;
export type BattleStatus = { [key in typeof battleStatus[number]]: string };
export type BattleStatusEnum = CairoCustomEnum;

// Type definition for `ashwood::models::unit::UnitClass` enum
export const unitClass = [
	'Infantry',
	'Pike',
	'Archer',
	'Cavalry',
	'Elite',
	'Support',
] as const;
export type UnitClass = { [key in typeof unitClass[number]]: string };
export type UnitClassEnum = CairoCustomEnum;

export interface AshwoodSchemaType extends ISchemaType {
	ashwood: {
		Army: Army,
		ArmyUnitPosition: ArmyUnitPosition,
		ArmyUnitPositionValue: ArmyUnitPositionValue,
		ArmyUnitUsed: ArmyUnitUsed,
		ArmyUnitUsedValue: ArmyUnitUsedValue,
		ArmyValue: ArmyValue,
		BattleField: BattleField,
		BattleFieldPosition: BattleFieldPosition,
		BattleFieldPositionValue: BattleFieldPositionValue,
		BattleFieldValue: BattleFieldValue,
		BattleZone: BattleZone,
		BattleZoneValue: BattleZoneValue,
		BattlefieldStats: BattlefieldStats,
		BattlefieldStatsValue: BattlefieldStatsValue,
		Unit: Unit,
		UnitValue: UnitValue,
		UnitAttacked: UnitAttacked,
		UnitAttackedValue: UnitAttackedValue,
		UnitDeployed: UnitDeployed,
		UnitDeployedValue: UnitDeployedValue,
		ArmyCreated: ArmyCreated,
		ArmyCreatedValue: ArmyCreatedValue,
		BattleCreated: BattleCreated,
		BattleCreatedValue: BattleCreatedValue,
		UnitDeployedToBattle: UnitDeployedToBattle,
		UnitDeployedToBattleValue: UnitDeployedToBattleValue,
		UnitEngagement: UnitEngagement,
		UnitEngagementValue: UnitEngagementValue,
		UnitMoved: UnitMoved,
		UnitMovedValue: UnitMovedValue,
		CombatCalculated: CombatCalculated,
		CombatCalculatedValue: CombatCalculatedValue,
		UnitCreated: UnitCreated,
		UnitCreatedValue: UnitCreatedValue,
		UnitStatsUpdated: UnitStatsUpdated,
		UnitStatsUpdatedValue: UnitStatsUpdatedValue,
	},
}
export const schema: AshwoodSchemaType = {
	ashwood: {
		Army: {
			commander_id: "",
			army_id: 0,
			name: 0,
		},
		ArmyUnitPosition: {
			commander_id: "",
			army_id: 0,
			unit_id: 0,
			position_index: 0,
			battlefield_id: 0,
		},
		ArmyUnitPositionValue: {
			position_index: 0,
			battlefield_id: 0,
		},
		ArmyUnitUsed: {
			commander_id: "",
			army_id: 0,
			battlefield_id: 0,
			unit_id: 0,
			turn: 0,
		},
		ArmyUnitUsedValue: {
			turn: 0,
		},
		ArmyValue: {
			name: 0,
		},
		BattleField: {
			battlefield_id: 0,
			defender_commander_id: "",
			invader_commander_id: "",
			battle_name: 0,
			defender_army_id: 0,
			invader_army_id: 0,
			defender_score: 0,
			invader_score: 0,
		status: new CairoCustomEnum({ 
					Initialized: "",
				WaitingForAttacker: undefined,
				Deploying: undefined,
				Strategizing: undefined,
				Engaged: undefined,
				DefenderVictory: undefined,
				AttackerVictory: undefined,
				Stalemate: undefined,
				Retreat: undefined,
				Aborted: undefined,
				RevealPending: undefined, }),
			current_turn: 0,
			turn_deadline: 0,
			season: 0,
			created_at: 0,
		last_action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Retreat: undefined,
				Special: undefined, }),
			last_action_timestamp: 0,
		},
		BattleFieldPosition: {
			battlefield_id: 0,
			position: 0,
			unit_id: 0,
			is_occupied: false,
			owner: "",
			army_id: 0,
		},
		BattleFieldPositionValue: {
			unit_id: 0,
			is_occupied: false,
			owner: "",
			army_id: 0,
		},
		BattleFieldValue: {
			defender_commander_id: "",
			invader_commander_id: "",
			battle_name: 0,
			defender_army_id: 0,
			invader_army_id: 0,
			defender_score: 0,
			invader_score: 0,
		status: new CairoCustomEnum({ 
					Initialized: "",
				WaitingForAttacker: undefined,
				Deploying: undefined,
				Strategizing: undefined,
				Engaged: undefined,
				DefenderVictory: undefined,
				AttackerVictory: undefined,
				Stalemate: undefined,
				Retreat: undefined,
				Aborted: undefined,
				RevealPending: undefined, }),
			current_turn: 0,
			turn_deadline: 0,
			season: 0,
			created_at: 0,
		last_action_type: new CairoCustomEnum({ 
					None: "",
				Attack: undefined,
				Retreat: undefined,
				Special: undefined, }),
			last_action_timestamp: 0,
		},
		BattleZone: {
			battlefield_id: 0,
			zone_position_id: 0,
			initial_deployment: false,
			has_units: false,
			first_unit_position: 0,
		},
		BattleZoneValue: {
			initial_deployment: false,
			has_units: false,
			first_unit_position: 0,
		},
		BattlefieldStats: {
			battlefield_id: 0,
			max_turns: 0,
			turns_remaining: 0,
			invader_units_deployed: 0,
			defender_units_deployed: 0,
			invader_units_remaining: 0,
			defender_units_remaining: 0,
			invader_units_eliminated: 0,
			defender_units_eliminated: 0,
			battle_duration: 0,
			invader_retreat: 0,
			defender_retreat: 0,
			last_updated: 0,
			is_complete: false,
		},
		BattlefieldStatsValue: {
			max_turns: 0,
			turns_remaining: 0,
			invader_units_deployed: 0,
			defender_units_deployed: 0,
			invader_units_remaining: 0,
			defender_units_remaining: 0,
			invader_units_eliminated: 0,
			defender_units_eliminated: 0,
			battle_duration: 0,
			invader_retreat: 0,
			defender_retreat: 0,
			last_updated: 0,
			is_complete: false,
		},
		Unit: {
			id: 0,
			player_name: 0,
		unit_class: new CairoCustomEnum({ 
					Infantry: "",
				Pike: undefined,
				Archer: undefined,
				Cavalry: undefined,
				Elite: undefined,
				Support: undefined, }),
			attack: 0,
			defense: 0,
			speed: 0,
			special: 0,
		},
		UnitValue: {
			player_name: 0,
		unit_class: new CairoCustomEnum({ 
					Infantry: "",
				Pike: undefined,
				Archer: undefined,
				Cavalry: undefined,
				Elite: undefined,
				Support: undefined, }),
			attack: 0,
			defense: 0,
			speed: 0,
			special: 0,
		},
		UnitAttacked: {
			battlefield_id: 0,
			attacker_unit_id: 0,
			target_unit_id: 0,
			damage_dealt: 0,
			turn: 0,
		},
		UnitAttackedValue: {
			attacker_unit_id: 0,
			target_unit_id: 0,
			damage_dealt: 0,
			turn: 0,
		},
		UnitDeployed: {
			battlefield_id: 0,
			unit_id: 0,
			position: 0,
			player: "",
			army_id: 0,
		},
		UnitDeployedValue: {
			unit_id: 0,
			position: 0,
			player: "",
			army_id: 0,
		},
		ArmyCreated: {
			commander_id: "",
			army_id: 0,
			name: 0,
		},
		ArmyCreatedValue: {
			army_id: 0,
			name: 0,
		},
		BattleCreated: {
			battlefield_id: 0,
			defender: "",
			invader: "",
			defender_army_id: 0,
			invader_army_id: 0,
			created_at: 0,
		},
		BattleCreatedValue: {
			defender: "",
			invader: "",
			defender_army_id: 0,
			invader_army_id: 0,
			created_at: 0,
		},
		UnitDeployedToBattle: {
			battlefield_id: 0,
			army_id: 0,
			unit_id: 0,
			global_position: 0,
			owner: "",
			turn: 0,
		},
		UnitDeployedToBattleValue: {
			army_id: 0,
			unit_id: 0,
			global_position: 0,
			owner: "",
			turn: 0,
		},
		UnitEngagement: {
			battlefield_id: 0,
			attacker_army_id: 0,
			attacker_unit_id: 0,
			target_unit_id: 0,
			damage_dealt: 0,
			turn: 0,
		},
		UnitEngagementValue: {
			attacker_army_id: 0,
			attacker_unit_id: 0,
			target_unit_id: 0,
			damage_dealt: 0,
			turn: 0,
		},
		UnitMoved: {
			battlefield_id: 0,
			army_id: 0,
			unit_id: 0,
			from_position: 0,
			to_position: 0,
			turn: 0,
		},
		UnitMovedValue: {
			army_id: 0,
			unit_id: 0,
			from_position: 0,
			to_position: 0,
			turn: 0,
		},
		CombatCalculated: {
			attacker_id: 0,
			target_id: 0,
			damage: 0,
			has_advantage: false,
		},
		CombatCalculatedValue: {
			target_id: 0,
			damage: 0,
			has_advantage: false,
		},
		UnitCreated: {
			player: "",
			id: 0,
			player_name: 0,
		unit_class: new CairoCustomEnum({ 
					Infantry: "",
				Pike: undefined,
				Archer: undefined,
				Cavalry: undefined,
				Elite: undefined,
				Support: undefined, }),
		},
		UnitCreatedValue: {
			id: 0,
			player_name: 0,
		unit_class: new CairoCustomEnum({ 
					Infantry: "",
				Pike: undefined,
				Archer: undefined,
				Cavalry: undefined,
				Elite: undefined,
				Support: undefined, }),
		},
		UnitStatsUpdated: {
			player: "",
			id: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			special: 0,
		},
		UnitStatsUpdatedValue: {
			id: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			special: 0,
		},
	},
};
export enum ModelsMapping {
	Army = 'ashwood-Army',
	ArmyUnitPosition = 'ashwood-ArmyUnitPosition',
	ArmyUnitPositionValue = 'ashwood-ArmyUnitPositionValue',
	ArmyUnitUsed = 'ashwood-ArmyUnitUsed',
	ArmyUnitUsedValue = 'ashwood-ArmyUnitUsedValue',
	ArmyValue = 'ashwood-ArmyValue',
	ActionType = 'ashwood-ActionType',
	BattleField = 'ashwood-BattleField',
	BattleFieldPosition = 'ashwood-BattleFieldPosition',
	BattleFieldPositionValue = 'ashwood-BattleFieldPositionValue',
	BattleFieldValue = 'ashwood-BattleFieldValue',
	BattleStatus = 'ashwood-BattleStatus',
	BattleZone = 'ashwood-BattleZone',
	BattleZoneValue = 'ashwood-BattleZoneValue',
	BattlefieldStats = 'ashwood-BattlefieldStats',
	BattlefieldStatsValue = 'ashwood-BattlefieldStatsValue',
	Unit = 'ashwood-Unit',
	UnitClass = 'ashwood-UnitClass',
	UnitValue = 'ashwood-UnitValue',
	UnitAttacked = 'ashwood-UnitAttacked',
	UnitAttackedValue = 'ashwood-UnitAttackedValue',
	UnitDeployed = 'ashwood-UnitDeployed',
	UnitDeployedValue = 'ashwood-UnitDeployedValue',
	ArmyCreated = 'ashwood-ArmyCreated',
	ArmyCreatedValue = 'ashwood-ArmyCreatedValue',
	BattleCreated = 'ashwood-BattleCreated',
	BattleCreatedValue = 'ashwood-BattleCreatedValue',
	UnitDeployedToBattle = 'ashwood-UnitDeployedToBattle',
	UnitDeployedToBattleValue = 'ashwood-UnitDeployedToBattleValue',
	UnitEngagement = 'ashwood-UnitEngagement',
	UnitEngagementValue = 'ashwood-UnitEngagementValue',
	UnitMoved = 'ashwood-UnitMoved',
	UnitMovedValue = 'ashwood-UnitMovedValue',
	CombatCalculated = 'ashwood-CombatCalculated',
	CombatCalculatedValue = 'ashwood-CombatCalculatedValue',
	UnitCreated = 'ashwood-UnitCreated',
	UnitCreatedValue = 'ashwood-UnitCreatedValue',
	UnitStatsUpdated = 'ashwood-UnitStatsUpdated',
	UnitStatsUpdatedValue = 'ashwood-UnitStatsUpdatedValue',
}