import { type AshwoodSchemaType, ModelsMapping, type Army, type ArmyUnitPosition, type ArmyUnitUsed, type BattleField, type BattleFieldPosition, type BattleZone, type BattlefieldStats,type Unit } from '../dojogen/models.gen';
import { ClauseBuilder, KeysClause, type ParsedEntity, ToriiQueryBuilder } from '@dojoengine/sdk';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useEffect, useRef } from 'react';
import { useGameStore } from './ashwoodStore';
import { hexToUtf8 } from './unpack';
import { useAshwoodStore } from './ashwood';
import { AccountInterface } from 'starknet';
import { useNetworkAccount } from '../context/WalletContex';
import { removeLeadingZeros } from './sanitizer';

let intervalId: NodeJS.Timeout | null = null; // Keep polling alive across components

// Helper to extract primitive value
const getPrimitiveValue = (field: any) => {
    if (field?.type === 'primitive') {
        switch (field.type_name) {
            case 'ContractAddress':
                return field.value;
            case 'u256':
            case 'u64':
                return BigInt(field.value).toString();
            case 'felt252':
                const utf8Value = hexToUtf8(field.value);
                if (utf8Value) return utf8Value;
                return BigInt(field.value).toString();
            case 'bool':
                return field.value;
            default:
                return Number(field.value);
        }
    }

    // Handle struct types
    if (field?.type === 'struct') {
        if (typeof field.value === 'object') {
            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(field.value)) {
                result[key] = getPrimitiveValue(value);
            }
            return result;
        }
        return getPrimitiveValue({
            type: 'primitive',
            type_name: field.type_name,
            value: field.value
        });
    }

    if (field?.type === 'enum') {
        return field.value.option;
    }
    return field;
};

// Transform functions
const transformArmy = (rawData: any): Army | null => {
    const armyData = rawData['ashwood-Army'];
    if (!armyData) return null;

    return {
        commander_id: getPrimitiveValue(armyData.commander_id),
        army_id: getPrimitiveValue(armyData.army_id),
        name: getPrimitiveValue(armyData.name),
    };
};

const transformArmyUnitPosition = (rawData: any): ArmyUnitPosition | null => {
    const armyUnitPositionData = rawData['ashwood-ArmyUnitPosition'];
    if (!armyUnitPositionData) return null;

    return {
        commander_id: getPrimitiveValue(armyUnitPositionData.commander_id),
        army_id: getPrimitiveValue(armyUnitPositionData.army_id),
        unit_id: getPrimitiveValue(armyUnitPositionData.unit_id),
        position_index: getPrimitiveValue(armyUnitPositionData.position_index),
        battlefield_id: getPrimitiveValue(armyUnitPositionData.battlefield_id),
    };
};

const transformArmyUnitUsed = (rawData: any): ArmyUnitUsed | null => {
    const armyUnitUsedData = rawData['ashwood-ArmyUnitUsed'];
    if (!armyUnitUsedData) return null;

    return {
        commander_id: getPrimitiveValue(armyUnitUsedData.commander_id),
        army_id: getPrimitiveValue(armyUnitUsedData.army_id),
        battlefield_id: getPrimitiveValue(armyUnitUsedData.battlefield_id),
        unit_id: getPrimitiveValue(armyUnitUsedData.unit_id),
        turn: getPrimitiveValue(armyUnitUsedData.turn),
    };
};

const transformBattleField = (rawData: any): BattleField | null => {
    const battleFieldData = rawData['ashwood-BattleField'];
    if (!battleFieldData) return null;

    return {
        battlefield_id: getPrimitiveValue(battleFieldData.battlefield_id),
        defender_commander_id: getPrimitiveValue(battleFieldData.defender_commander_id),
        invader_commander_id: getPrimitiveValue(battleFieldData.invader_commander_id),
        battle_name: getPrimitiveValue(battleFieldData.battle_name),
        defender_army_id: getPrimitiveValue(battleFieldData.defender_army_id),
        invader_army_id: getPrimitiveValue(battleFieldData.invader_army_id),
        defender_score: getPrimitiveValue(battleFieldData.defender_score),
        invader_score: getPrimitiveValue(battleFieldData.invader_score),
        status: getPrimitiveValue(battleFieldData.status),
        current_turn: getPrimitiveValue(battleFieldData.current_turn),
        turn_deadline: getPrimitiveValue(battleFieldData.turn_deadline),
        season: getPrimitiveValue(battleFieldData.season),
        created_at: getPrimitiveValue(battleFieldData.created_at),
        last_action_type: getPrimitiveValue(battleFieldData.last_action_type),
        last_action_timestamp: getPrimitiveValue(battleFieldData.last_action_timestamp),
    };
};

const transformBattleFieldPosition = (rawData: any): BattleFieldPosition | null => {
    const battleFieldPositionData = rawData['ashwood-BattleFieldPosition'];
    if (!battleFieldPositionData) return null;

    return {
        battlefield_id: getPrimitiveValue(battleFieldPositionData.battlefield_id),
        position: getPrimitiveValue(battleFieldPositionData.position),
        unit_id: getPrimitiveValue(battleFieldPositionData.unit_id),
        is_occupied: getPrimitiveValue(battleFieldPositionData.is_occupied),
        owner: getPrimitiveValue(battleFieldPositionData.owner),
        army_id: getPrimitiveValue(battleFieldPositionData.army_id),
    };
};

const transformBattleZone = (rawData: any): BattleZone | null => {
    const battleZoneData = rawData['ashwood-BattleZone'];
    if (!battleZoneData) return null;

    return {
        battlefield_id: getPrimitiveValue(battleZoneData.battlefield_id),
        zone_position_id: getPrimitiveValue(battleZoneData.zone_position_id),
        initial_deployment: getPrimitiveValue(battleZoneData.initial_deployment),
        has_units: getPrimitiveValue(battleZoneData.has_units),
        first_unit_position: getPrimitiveValue(battleZoneData.first_unit_position),
    };
};

const transformBattlefieldStats = (rawData: any): BattlefieldStats | null => {
    const battlefieldStatsData = rawData['ashwood-BattlefieldStats'];
    if (!battlefieldStatsData) return null;

    return {
        battlefield_id: getPrimitiveValue(battlefieldStatsData.battlefield_id),
        max_turns: getPrimitiveValue(battlefieldStatsData.max_turns),
        turns_remaining: getPrimitiveValue(battlefieldStatsData.turns_remaining),
        invader_units_deployed: getPrimitiveValue(battlefieldStatsData.invader_units_deployed),
        defender_units_deployed: getPrimitiveValue(battlefieldStatsData.defender_units_deployed),
        invader_units_remaining: getPrimitiveValue(battlefieldStatsData.invader_units_remaining),
        defender_units_remaining: getPrimitiveValue(battlefieldStatsData.defender_units_remaining),
        invader_units_eliminated: getPrimitiveValue(battlefieldStatsData.invader_units_eliminated),
        defender_units_eliminated: getPrimitiveValue(battlefieldStatsData.defender_units_eliminated),
        battle_duration: getPrimitiveValue(battlefieldStatsData.battle_duration),
        invader_retreat: getPrimitiveValue(battlefieldStatsData.invader_retreat),
        defender_retreat: getPrimitiveValue(battlefieldStatsData.defender_retreat),
        last_updated: getPrimitiveValue(battlefieldStatsData.last_updated),
        is_complete: getPrimitiveValue(battlefieldStatsData.is_complete),
    };
};

const transformUnit = (rawData: any): Unit | null => {
    const unitData = rawData['ashwood-Unit'];
    if (!unitData) return null;

    return {
        id: getPrimitiveValue(unitData.id),
        player_name: getPrimitiveValue(unitData.player_name),
        unit_class: getPrimitiveValue(unitData.unit_class),
        attack: getPrimitiveValue(unitData.attack),
        defense: getPrimitiveValue(unitData.defense),
        speed: getPrimitiveValue(unitData.speed),
        special: getPrimitiveValue(unitData.special),
    };
};

const transformEntities = (rawEntities: any[], transformFn: (data: any) => any) => {
    return rawEntities
        .map(entity => transformFn(entity))
        .filter(entity => entity !== null);
};

export const useAllEntities = (pollInterval = 5000) => {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const state = useDojoStore((state) => state);
    const { 
        setArmy, 
        setArmyUnitPosition, 
        setArmyUnitUsed,
        setBattleField, 
        setBattleFieldPosition, 
        setBattleZone, 
        setBattlefieldStats,
        setUnit,
        setPlayerArmy,
        loadPlayerUnits,
        loadUsedUnits,
        loadDefenderBattleUnits,
        loadInvaderBattleUnits
    } = useGameStore();
  
    const { battle_id, army_id,invader_id,defender_id } =  useAshwoodStore();
    const { account,address } = useNetworkAccount();

    const get_new_army_id = () => army_id;

    console.log("------",army_id)


    const fetchAllEntities = async () => {


        try {
            const queryBuilder = new ToriiQueryBuilder()
                .withClause(
                    new ClauseBuilder()
                        .keys([], [undefined], "VariableLen")
                        .build()
                );
                
            const res = await sdk.client.getEntities(queryBuilder.build());
            
            console.log("Raw entities:", res);
            console.log(army_id)

            // Convert object to array if it's not already
            const entityArray = Array.isArray(res) ? res : Object.values(res);
                          
            entityArray.forEach((entity) => {
 

                try {
                    // Army entities
                    if ('ashwood-Army' in entity) {
                        const army = transformArmy(entity);
                        if (army) {
                            setArmy(army);
                            if (removeLeadingZeros(army.commander_id) === account.address) {
                                setPlayerArmy(army);
                            }
                        }
                    }
                    
                    if ('ashwood-ArmyUnitPosition' in entity) {
                        const armyUnitPosition = transformArmyUnitPosition(entity);
                        if (armyUnitPosition) {
                            setArmyUnitPosition(armyUnitPosition);
                        };
                    }
                    
                    if ('ashwood-ArmyUnitUsed' in entity) {
                        const armyUnitUsed = transformArmyUnitUsed(entity);
                        if (armyUnitUsed) setArmyUnitUsed(armyUnitUsed);
                    }

                    // Battlefield entities
                    if ('ashwood-BattleField' in entity) {
                        const battleField = transformBattleField(entity);
                        if (battleField) setBattleField(battleField);
                    }
                    
                    if ('ashwood-BattleFieldPosition' in entity) {
                        const battleFieldPosition = transformBattleFieldPosition(entity);
                        if (battleFieldPosition) setBattleFieldPosition(battleFieldPosition);
                    }
                    
                    if ('ashwood-BattleZone' in entity) {
                        const battleZone = transformBattleZone(entity);
                        if (battleZone) setBattleZone(battleZone);
                    }
                    
                    if ('ashwood-BattlefieldStats' in entity) {
                        const battlefieldStats = transformBattlefieldStats(entity);
                        if (battlefieldStats) setBattlefieldStats(battlefieldStats);
                    }

                    // Unit entities
                    if ('ashwood-Unit' in entity) {
                        const unit = transformUnit(entity);
                        if (unit) setUnit(unit);
                    }
                } catch (error) {
                    console.error("Error processing entity:", entity, error);
                }
            });

            console.log("hallo",get_new_army_id())

            // Load additional player-specific data if we have the required IDs
            if (army_id > 0) {
                console.log("hallo")
                // loadPlayerUnits(account.address, army_id);
            }

            if (army_id > 0 && battle_id > 0 && invader_id !== "" && defender_id !== "") {
                // loadUsedUnits(account.address, army_id, battle_id);
                    // Load invader battle units
                loadInvaderBattleUnits(invader_id, battle_id.toString(), army_id.toString());
                
                // Load defender battle units  
                loadDefenderBattleUnits(defender_id, battle_id.toString(), army_id.toString());
            }

            return {
                armies: entityArray.filter(e => 'ashwood-Army' in e).map(transformArmy).filter(Boolean),
                armyUnitPositions: entityArray.filter(e => 'ashwood-ArmyUnitPosition' in e).map(transformArmyUnitPosition).filter(Boolean),
                armyUnitsUsed: entityArray.filter(e => 'ashwood-ArmyUnitUsed' in e).map(transformArmyUnitUsed).filter(Boolean),
                battleFields: entityArray.filter(e => 'ashwood-BattleField' in e).map(transformBattleField).filter(Boolean),
                battleFieldPositions: entityArray.filter(e => 'ashwood-BattleFieldPosition' in e).map(transformBattleFieldPosition).filter(Boolean),
                battleZones: entityArray.filter(e => 'ashwood-BattleZone' in e).map(transformBattleZone).filter(Boolean),
                battlefieldStats: entityArray.filter(e => 'ashwood-BattlefieldStats' in e).map(transformBattlefieldStats).filter(Boolean),
                units: entityArray.filter(e => 'ashwood-Unit' in e).map(transformUnit).filter(Boolean),
            };

        } catch (error) {
            console.error("Error fetching entities:", error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;
        let intervalId: NodeJS.Timeout;
  
        const startPolling = async () => {
            if (!sdk?.client) return;
            
            // Initial fetch
            await fetchAllEntities();
  
            // Set up polling only if component is still mounted
            if (isMounted) {
                intervalId = setInterval(fetchAllEntities, pollInterval);
            }
        };
  
        startPolling();
  
        // Cleanup
        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [pollInterval, sdk?.client,army_id,battle_id,invader_id,defender_id]);

    return {
        state: useGameStore(),
        refetch: fetchAllEntities
    };
};