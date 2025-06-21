import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_attackUnit_calldata = (battlefieldId: BigNumberish, attackerUnitId: BigNumberish, targetUnitId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "attack_unit",
			calldata: [battlefieldId, attackerUnitId, targetUnitId],
		};
	};

	const actions_attackUnit = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, attackerUnitId: BigNumberish, targetUnitId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_attackUnit_calldata(battlefieldId, attackerUnitId, targetUnitId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_moveUnit_calldata = (battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish, fromPosition: BigNumberish, toPosition: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "move_unit",
			calldata: [battlefieldId, armyId, unitId, fromPosition, toPosition],
		};
	};

	const actions_moveUnit = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish, fromPosition: BigNumberish, toPosition: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_moveUnit_calldata(battlefieldId, armyId, unitId, fromPosition, toPosition),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_retreatUnit_calldata = (battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "retreat_unit",
			calldata: [battlefieldId, armyId, unitId],
		};
	};

	const actions_retreatUnit = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_retreatUnit_calldata(battlefieldId, armyId, unitId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_addUnitToArmy_calldata = (armyId: BigNumberish, unitId: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "add_unit_to_army",
			calldata: [armyId, unitId],
		};
	};

	const armies_addUnitToArmy = async (snAccount: Account | AccountInterface, armyId: BigNumberish, unitId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_addUnitToArmy_calldata(armyId, unitId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_createArmy_calldata = (armyId: BigNumberish, name: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "create_army",
			calldata: [armyId, name],
		};
	};

	const armies_createArmy = async (snAccount: Account | AccountInterface, armyId: BigNumberish, name: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_createArmy_calldata(armyId, name),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_isUnitUsedThisTurn_calldata = (armyId: BigNumberish, battlefieldId: BigNumberish, unitId: BigNumberish, turn: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "is_unit_used_this_turn",
			calldata: [armyId, battlefieldId, unitId, turn],
		};
	};

	const armies_isUnitUsedThisTurn = async (snAccount: Account | AccountInterface, armyId: BigNumberish, battlefieldId: BigNumberish, unitId: BigNumberish, turn: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_isUnitUsedThisTurn_calldata(armyId, battlefieldId, unitId, turn),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_markUnitUsed_calldata = (armyId: BigNumberish, battlefieldId: BigNumberish, unitId: BigNumberish, turn: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "mark_unit_used",
			calldata: [armyId, battlefieldId, unitId, turn],
		};
	};

	const armies_markUnitUsed = async (snAccount: Account | AccountInterface, armyId: BigNumberish, battlefieldId: BigNumberish, unitId: BigNumberish, turn: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_markUnitUsed_calldata(armyId, battlefieldId, unitId, turn),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_removeUnitFromArmy_calldata = (armyId: BigNumberish, unitId: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "remove_unit_from_army",
			calldata: [armyId, unitId],
		};
	};

	const armies_removeUnitFromArmy = async (snAccount: Account | AccountInterface, armyId: BigNumberish, unitId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_removeUnitFromArmy_calldata(armyId, unitId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_armies_renameArmy_calldata = (armyId: BigNumberish, newName: BigNumberish): DojoCall => {
		return {
			contractName: "armies",
			entrypoint: "rename_army",
			calldata: [armyId, newName],
		};
	};

	const armies_renameArmy = async (snAccount: Account | AccountInterface, armyId: BigNumberish, newName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_armies_renameArmy_calldata(armyId, newName),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_battlefields_createBattle_calldata = (battlefieldId: BigNumberish, invaderArmyId: BigNumberish, battleName: BigNumberish): DojoCall => {
		return {
			contractName: "battlefields",
			entrypoint: "create_battle",
			calldata: [battlefieldId, invaderArmyId, battleName],
		};
	};

	const battlefields_createBattle = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, invaderArmyId: BigNumberish, battleName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_battlefields_createBattle_calldata(battlefieldId, invaderArmyId, battleName),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_battlefields_deployUnitToBattlefield_calldata = (battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish, globalPosition: BigNumberish): DojoCall => {
		return {
			contractName: "battlefields",
			entrypoint: "deploy_unit_to_battlefield",
			calldata: [battlefieldId, armyId, unitId, globalPosition],
		};
	};

	const battlefields_deployUnitToBattlefield = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, armyId: BigNumberish, unitId: BigNumberish, globalPosition: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_battlefields_deployUnitToBattlefield_calldata(battlefieldId, armyId, unitId, globalPosition),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_battlefields_joinBattle_calldata = (battlefieldId: BigNumberish, armyId: BigNumberish): DojoCall => {
		return {
			contractName: "battlefields",
			entrypoint: "join_battle",
			calldata: [battlefieldId, armyId],
		};
	};

	const battlefields_joinBattle = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish, armyId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_battlefields_joinBattle_calldata(battlefieldId, armyId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_battlefields_startBattle_calldata = (battlefieldId: BigNumberish): DojoCall => {
		return {
			contractName: "battlefields",
			entrypoint: "start_battle",
			calldata: [battlefieldId],
		};
	};

	const battlefields_startBattle = async (snAccount: Account | AccountInterface, battlefieldId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_battlefields_startBattle_calldata(battlefieldId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_units_canSupport_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "units",
			entrypoint: "can_support",
			calldata: [id],
		};
	};

	const units_canSupport = async (snAccount: Account | AccountInterface, id: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_units_canSupport_calldata(id),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_units_checkAdvantage_calldata = (attackerId: BigNumberish, targetId: BigNumberish): DojoCall => {
		return {
			contractName: "units",
			entrypoint: "check_advantage",
			calldata: [attackerId, targetId],
		};
	};

	const units_checkAdvantage = async (snAccount: Account | AccountInterface, attackerId: BigNumberish, targetId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_units_checkAdvantage_calldata(attackerId, targetId),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_units_createUnit_calldata = (id: BigNumberish, playerName: BigNumberish, unitClass: CairoCustomEnum, attack: BigNumberish, defense: BigNumberish, speed: BigNumberish, special: BigNumberish): DojoCall => {
		return {
			contractName: "units",
			entrypoint: "create_unit",
			calldata: [id, playerName, unitClass, attack, defense, speed, special],
		};
	};

	const units_createUnit = async (snAccount: Account | AccountInterface, id: BigNumberish, playerName: BigNumberish, unitClass: CairoCustomEnum, attack: BigNumberish, defense: BigNumberish, speed: BigNumberish, special: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_units_createUnit_calldata(id, playerName, unitClass, attack, defense, speed, special),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_units_isRanged_calldata = (id: BigNumberish): DojoCall => {
		return {
			contractName: "units",
			entrypoint: "is_ranged",
			calldata: [id],
		};
	};

	const units_isRanged = async (snAccount: Account | AccountInterface, id: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_units_isRanged_calldata(id),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_units_updateUnitStats_calldata = (id: BigNumberish, attack: BigNumberish, defense: BigNumberish, speed: BigNumberish, special: BigNumberish): DojoCall => {
		return {
			contractName: "units",
			entrypoint: "update_unit_stats",
			calldata: [id, attack, defense, speed, special],
		};
	};

	const units_updateUnitStats = async (snAccount: Account | AccountInterface, id: BigNumberish, attack: BigNumberish, defense: BigNumberish, speed: BigNumberish, special: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_units_updateUnitStats_calldata(id, attack, defense, speed, special),
				"ashwood",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			attackUnit: actions_attackUnit,
			buildAttackUnitCalldata: build_actions_attackUnit_calldata,
			moveUnit: actions_moveUnit,
			buildMoveUnitCalldata: build_actions_moveUnit_calldata,
			retreatUnit: actions_retreatUnit,
			buildRetreatUnitCalldata: build_actions_retreatUnit_calldata,
		},
		armies: {
			addUnitToArmy: armies_addUnitToArmy,
			buildAddUnitToArmyCalldata: build_armies_addUnitToArmy_calldata,
			createArmy: armies_createArmy,
			buildCreateArmyCalldata: build_armies_createArmy_calldata,
			isUnitUsedThisTurn: armies_isUnitUsedThisTurn,
			buildIsUnitUsedThisTurnCalldata: build_armies_isUnitUsedThisTurn_calldata,
			markUnitUsed: armies_markUnitUsed,
			buildMarkUnitUsedCalldata: build_armies_markUnitUsed_calldata,
			removeUnitFromArmy: armies_removeUnitFromArmy,
			buildRemoveUnitFromArmyCalldata: build_armies_removeUnitFromArmy_calldata,
			renameArmy: armies_renameArmy,
			buildRenameArmyCalldata: build_armies_renameArmy_calldata,
		},
		battlefields: {
			createBattle: battlefields_createBattle,
			buildCreateBattleCalldata: build_battlefields_createBattle_calldata,
			deployUnitToBattlefield: battlefields_deployUnitToBattlefield,
			buildDeployUnitToBattlefieldCalldata: build_battlefields_deployUnitToBattlefield_calldata,
			joinBattle: battlefields_joinBattle,
			buildJoinBattleCalldata: build_battlefields_joinBattle_calldata,
			startBattle: battlefields_startBattle,
			buildStartBattleCalldata: build_battlefields_startBattle_calldata,
		},
		units: {
			canSupport: units_canSupport,
			buildCanSupportCalldata: build_units_canSupport_calldata,
			checkAdvantage: units_checkAdvantage,
			buildCheckAdvantageCalldata: build_units_checkAdvantage_calldata,
			createUnit: units_createUnit,
			buildCreateUnitCalldata: build_units_createUnit_calldata,
			isRanged: units_isRanged,
			buildIsRangedCalldata: build_units_isRanged_calldata,
			updateUnitStats: units_updateUnitStats,
			buildUpdateUnitStatsCalldata: build_units_updateUnitStats_calldata,
		},
	};
}