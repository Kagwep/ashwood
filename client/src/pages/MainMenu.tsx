import CreateArmyModal from '../components/ArmyModal';
import WalletButton from '../components/WalletButton';
import React, { useState } from 'react';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojo } from '../dojo/useDojo';
import { Account, CairoCustomEnum } from 'starknet';
import { toast } from 'react-toastify';
import { useAshwoodStore } from '../utils/ashwood';
import { useAllEntities } from '../utils/ash';
import { getAllUnitIds, getBattleStatusColor, getUnitsByIds, parseStarknetError } from '../utils';
import AddUnitModal from '../components/addUnitModal';
import { ensureHexZeroPrefix, removeLeadingZeros } from '../utils/sanitizer';
import AddUnitToArmyModal from '../components/addUnitToArmy';
import CreateBattleModal from '../components/CreateBattleModal';
import GameState from '../utils/gamestate';
import type { Unit } from '../dojogen/models.gen';

const AshwoodMainMenu = () => {
  const [activeTab, setActiveTab] = useState('battles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUnit, setIsModalOpenUnit] = useState(false);
  const [isModalOpenUnitArmy, setIsModalOpenUnitArmy] = useState(false);
  const [isModalOpenBattle, setIsModalOpenBAttle] = useState(false);
  const [playerArmyUnits, setPlayerUnits] = useState<Record<string, Unit>>({});

    const {
      setup: {
        client
      },
    } = useDojo();

  const { account,address } = useNetworkAccount();

  const { set_game_state,set_army_id,set_battle_id, battle_id, army_id,setDefenderId,setInvaderId} = useAshwoodStore();

  const { state, refetch } = useAllEntities();

  const playerArmies = state.playerArmies;

  const units  = state.units;

  const battles = state.battleFields;

  

 console.log(playerArmyUnits)

    const handleCreateArmy = async (name) => {
    // This would call your actual contract function
    console.log('Creating army:', { name });

    const army_id = Object.keys(playerArmies).length + 1;

    console.log(army_id)
    
        try {
        let result = await (await client).armies.createArmy(
          account as Account,
          army_id,
          name
        );
  
      if (result && result.transaction_hash) {
          toast.success(`${name} army created. You can now add units`);
        }
    
        } catch (error: any) {
          const errorParsed = parseStarknetError(error);

          console.log(errorParsed)

          if (errorParsed){
            toast.error(errorParsed);
          }else{
            toast.error("failed to create Army");
          }
      }
  };


    const handleCreateUnit = async (unitData) => {
    // This would call your actual contract function
    console.log('Creating unit:', unitData);
    
    console.log(unitData)

        try {
          const unit_id = Object.keys(units).length + 1;

        let result = await (await client).units.createUnit(
          account as Account,
          unit_id,
          unitData.playerName,
          new CairoCustomEnum({ [unitData.unitClass]: "()" }),
          unitData.attack,
          unitData.defense,
          unitData.speed,
          unitData.special
        );

        if (result && result.transaction_hash) {
          toast.success(`${unitData.playerName} added to ashwood }`);
        }
      } catch (error: any) {
      const errorParsed = parseStarknetError(error);

      console.log(errorParsed)

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error("failed to Create unit");
      }
        
      }
  
  };


  const getSeasonIcon = (season) => {
    switch(season) {
      case 'winter': return '❄️';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      default: return '🌟';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting': return 'bg-blue-600/80 border-blue-400 text-blue-100';
      case 'active': return 'bg-green-600/80 border-green-400 text-green-100';
      case 'completed': return 'bg-gray-600/80 border-gray-400 text-gray-100';
      default: return 'bg-amber-600/80 border-amber-400 text-amber-100';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'recruit': return 'text-green-400';
      case 'veteran': return 'text-yellow-400';
      case 'elite': return 'text-orange-400';
      case 'legendary': return 'text-red-400';
      default: return 'text-amber-400';
    }
  };

  const CLASS_ICONS = {
    'Infantry': '🛡️',
    'Cavalry': '🐎',
    'Pike': '🔱',
    'Archer': '🏹',
    'Elite': '⭐',
    'Support': '🏴'
  };

  const handleJoinBattle = async (battleId) => {

    if (army_id <= 0){
      toast.info("select army in units");
      return
    }
          
      try {
        let result = await (await client).battlefields.joinBattle(
          account as Account,
          battleId,
          army_id
        );
  
      if (result && result.transaction_hash) {
          toast.success(`Joined Battle`);
          set_battle_id(battleId);
        }
    
        } catch (error: any) {
          const errorParsed = parseStarknetError(error);

          console.log(errorParsed)

          if (errorParsed){
            toast.error(errorParsed);
          }else{
            toast.error("failed to create Battle");
          }
      }
  };



      const handleNavigateToUnits = () => {
        console.log('Navigating to Units');
        // Implement navigation to units page
      };

      const handleAddToArmy = (unit) => {
        console.log(`Adding ${unit.name} to forces`);

        if (army_id < 0 ) {
          toast.error("please selct army to add unit to")
          return;
        }

        const army = playerArmies[`${army_id}_${ensureHexZeroPrefix(account.address)}`];

        state.setSelectedUnit(unit);

        state.setSelectedArmy(army);

        setIsModalOpenUnitArmy(true)
      };

  const handleConfirm = async (armyId, unitId) => {
           try {
       //army_id: u8, unit_id: u128

        let result = await (await client).armies.addUnitToArmy(
          account as Account,
          armyId,
          unitId
        );

        if (result && result.transaction_hash) {
          toast.success(`Unit added}`);
        }
      } catch (error: any) {
      const errorParsed = parseStarknetError(error);

      console.log(errorParsed)

      if (errorParsed){
        toast.error(errorParsed);
      }else{
        toast.error("failed to add Unit");
      }
        
      }
  };

    const handleCreateBattle = async (selectedArmy) => {

      const battle_id = Object.keys(battles).length + 1;
            
      try {
        let result = await (await client).battlefields.createBattle(
          account as Account,
          battle_id,
          selectedArmy.army_id,
          0
        );
  
      if (result && result.transaction_hash) {
          toast.success(`Battle created`);
        }
    
        } catch (error: any) {
          const errorParsed = parseStarknetError(error);

          console.log(errorParsed)

          if (errorParsed){
            toast.error(errorParsed);
          }else{
            toast.error("failed to create Battle");
          }
      }
  };

  const handleEnterBattle =  (battleId,invaderId,defenderId,army_id) =>{
    set_army_id(army_id)
    set_battle_id(battleId)
    set_game_state(GameState.Arena)
    setDefenderId(defenderId);
    setInvaderId(invaderId);

  }

    const handleStartBattle = async (battleId) => {

      try {
        let result = await (await client).battlefields.startBattle(
          account as Account,
          battleId
        );
  
      if (result && result.transaction_hash) {
          toast.success(`Battle Started`);
        }
    
        } catch (error: any) {
          const errorParsed = parseStarknetError(error);

          console.log(errorParsed)

          if (errorParsed){
            toast.error(errorParsed);
          }else{
            toast.error("failed to start Battle");
          }
      }
  };

  const handleArmyClick = (army_id) => {
    set_army_id(army_id)

    console.log(army_id)

    const unitIds = getAllUnitIds(state.armyUnitPositions,account.address,army_id);

    console.log(unitIds)

    const allArmyUnits = getUnitsByIds(state.units, unitIds);

    setPlayerUnits(allArmyUnits);

    console.log("hjgdsfdsjkgkfskjdfhjskhfefefe",allArmyUnits)
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`
             }} />
      </div>

      {/* Floating Combat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl text-amber-600/15 animate-bounce">⚔️</div>
        <div className="absolute top-40 right-32 text-3xl text-amber-500/20 animate-pulse">🛡️</div>
        <div className="absolute bottom-32 left-40 text-4xl text-amber-700/15 animate-ping">🏰</div>
        <div className="absolute bottom-20 right-20 text-2xl text-amber-600/15 animate-bounce">🐎</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">⚔️</span>
            <div>
              <h1 className="text-4xl font-bold text-amber-300"
                  style={{
                    fontFamily: 'serif',
                    textShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
                  }}>
                ASHWOOD
              </h1>
              <p className="text-amber-400 text-sm">COMMAND CENTER</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('battles')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                activeTab === 'battles'
                  ? 'bg-amber-700 border-amber-500 text-amber-100 shadow-lg'
                  : 'bg-amber-900/50 border-amber-600/50 text-amber-300 hover:bg-amber-800/50'
              }`}
            >
              ⚔️ Battles
            </button>
            <button
              onClick={() => {
                setActiveTab('units');
                handleNavigateToUnits();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                activeTab === 'units'
                  ? 'bg-amber-700 border-amber-500 text-amber-100 shadow-lg'
                  : 'bg-amber-900/50 border-amber-600/50 text-amber-300 hover:bg-amber-800/50'
              }`}
            >
              ♘ Units
            </button>
            <WalletButton />
          </div>
        </div>

        {/* Battles Section */}
        {activeTab === 'battles' && (
          <div className="space-y-6">
            {/* Create Battle Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-300">🏛️ Active Battlefields</h2>
              <button
                 onClick={() => setIsModalOpenBAttle(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 
                          border-2 border-amber-500 rounded-lg font-bold text-amber-100
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          transition-all duration-300 shadow-lg"
              >
                ⚔️ CREATE BATTLE
              </button>
            </div>

            {/* Battle Table */}
            <div className="bg-gradient-to-r from-amber-900/60 to-amber-800/60 
                           border-2 border-amber-600/50 rounded-xl backdrop-blur-sm overflow-hidden">
              
              {/* Table Header */}
              <div className="bg-amber-800/60 border-b border-amber-600/50 p-4">
                <div className="grid grid-cols-8 gap-4 text-sm font-bold text-amber-300">
                  <div className="col-span-2">Battle Name</div>
                  <div>Host</div>
                  <div>Status</div>
                  <div>Players</div>
                  <div>Difficulty</div>
                  <div>Reward</div>
                  <div>Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-amber-600/30">
              {Object.values(battles).map((battlefield) => {
                const isUserDefender = removeLeadingZeros(battlefield.defender_commander_id) === removeLeadingZeros(account.address);
                const isUserInvader = removeLeadingZeros(battlefield.invader_commander_id) === removeLeadingZeros(account.address);
                const isUserInBattle = isUserDefender || isUserInvader;
                
                // Determine winner based on status
                const getWinner = () => {
                  if (battlefield.status as unknown as string === 'DefenderVictory') {
                    return isUserDefender ? 'You' : `${battlefield.defender_commander_id.slice(0, 8)}...`;
                  } else if (battlefield.status as unknown as string === 'AttackerVictory') {
                    return isUserInvader ? 'You' : `${battlefield.invader_commander_id.slice(0, 8)}...`;
                  }
                  return null;
                };
                
                const winner = getWinner();

                const army_id = isUserDefender ? battlefield.defender_army_id : battlefield.invader_army_id;
                console.log(army_id)
                
                return (
                  <div key={battlefield.battlefield_id} 
                      className="p-4 hover:bg-amber-800/40 transition-all duration-200">
                    <div className="grid grid-cols-8 gap-4 items-center text-sm">
                      
                      {/* Battle Name & Created */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚔️</span>
                          <div>
                            <div className="text-amber-300 font-medium">
                              Battle #{battlefield.battlefield_id}
                            </div>
                            <div className="text-amber-400 text-xs">
                              Turn {battlefield.current_turn}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Invader */}
                      <div className="text-amber-200">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">⚔️</span>
                          <span className={isUserInvader ? 'text-red-400 font-bold' : ''}>
                            {battlefield.invader_commander_id === '0x0' || !battlefield.invader_commander_id ? 
                              'Open' : 
                              isUserInvader ? 'You' : `${battlefield.invader_commander_id.slice(0, 8)}...`
                            }
                          </span>
                        </div>
                        <div className="text-xs text-amber-500">
                          {battlefield.invader_army_id !== '0' ? `Army #${battlefield.invader_army_id}` : 'No Army'}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getBattleStatusColor(battlefield.status as unknown as string)}`}>
                          {(battlefield.status as unknown as string)}
                        </div>
                      </div>
                      

                      {/* Defender */}
                      <div className="text-amber-200">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🛡️</span>
                          <span className={isUserDefender ? 'text-green-400 font-bold' : ''}>
                            {isUserDefender ? 'You' : `${battlefield.defender_commander_id.slice(0, 8)}...`}
                          </span>
                        </div>
                        <div className="text-xs text-amber-500">
                          Army #{battlefield.defender_army_id}
                        </div>
                      </div>
                      
                      {/* Score */}
                      <div className="text-amber-200 font-medium">
                        {battlefield.defender_score} - {battlefield.invader_score}
                      </div>
                      
                      {/* Turn Deadline */}
                      <div className="text-amber-200 font-medium text-xs">
                        {battlefield.turn_deadline as number > 0 ? 
                          `${battlefield.turn_deadline}s` : 
                          'No limit'
                        }
                      </div>
                      
                      {/* Action */}
                      <div>
                        {battlefield.status as unknown as string === 'WaitingForAttacker' && !isUserInBattle ? (
                          <button
                            onClick={() => handleJoinBattle(battlefield.battlefield_id)}
                            className="px-3 py-1 bg-gradient-to-r from-green-700 to-green-600 
                                      border border-green-500 rounded text-green-100 text-xs font-bold
                                      hover:from-green-600 hover:to-green-500 transition-all duration-200"
                          >
                            JOIN
                          </button>
                        ) : battlefield.status as unknown as string === 'Deploying' || battlefield.status as unknown as string === 'Strategizing' || battlefield.status as unknown as string === 'Engaged' ? (
                          isUserInBattle ? (
                            <button
                              onClick={() => handleEnterBattle(battlefield.battlefield_id,battlefield.invader_commander_id,battlefield.defender_commander_id,army_id)}
                              className="px-3 py-1 bg-gradient-to-r from-blue-700 to-blue-600 
                                        border border-blue-500 rounded text-blue-100 text-xs font-bold
                                        hover:from-blue-600 hover:to-blue-500 transition-all duration-200"
                            >
                              ENTER
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnterBattle(battlefield.battlefield_id,battlefield.invader_commander_id,battlefield.defender_commander_id,army_id)}
                              className="px-3 py-1 bg-gradient-to-r from-purple-700 to-purple-600 
                                        border border-purple-500 rounded text-purple-100 text-xs font-bold
                                        hover:from-purple-600 hover:to-purple-500 transition-all duration-200"
                            >
                              WATCH
                            </button>
                          )
                        ) : battlefield.status as unknown as string === 'Initialized' && isUserInvader ? (
                          <button
                            onClick={() => handleStartBattle(battlefield.battlefield_id)}
                            className="px-3 py-1 bg-gradient-to-r from-yellow-700 to-yellow-600 
                                      border border-yellow-500 rounded text-yellow-100 text-xs font-bold
                                      hover:from-yellow-600 hover:to-yellow-500 transition-all duration-200"
                          >
                            START
                          </button>
                        ) : (
                          <span className="px-3 py-1 bg-gray-600/50 border border-gray-400/50 
                                        rounded text-gray-300 text-xs font-bold">
                            ....
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Winner info for completed battles */}
                    {winner && (
                      <div className="mt-2 text-xs text-green-400 ml-8">
                        🏆 Winner: {winner}
                      </div>
                    )}
                    
                    {/* Additional battle info */}
                    {isUserInBattle && (
                      <div className="mt-2 text-xs text-blue-400 ml-8">
                        👤 You are the {isUserDefender ? 'Defender' : 'Invader'} in this battle
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            </div>

            {/* Battle Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{battles.filter(b => b.status === 'active').length}</div>
                <div className="text-amber-200 text-sm">Active Battles</div>
              </div>
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{battles.filter(b => b.status === 'waiting').length}</div>
                <div className="text-amber-200 text-sm">Awaiting Players</div>
              </div>
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{battles.filter(b => b.status === 'completed').length}</div>
                <div className="text-amber-200 text-sm">Completed Today</div>
              </div>
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{battles.reduce((acc, b) => acc + b.players, 0)}</div>
                <div className="text-amber-200 text-sm">Total Commanders</div>
              </div>
            </div> */}
          </div>
        )}

        {/* Units Section */}
        {activeTab === 'units' && (
          <div className="space-y-6">
            {/* Units Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-300">🪖 Unit Barracks</h2>
                <div >
                                <button
                onClick={() => setIsModalOpenUnit(true)}
                className="px-6 mx-2 py-3 bg-gradient-to-r from-amber-700 to-amber-600 
                          border-2 border-amber-500 rounded-lg font-bold text-amber-100
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          transition-all duration-300 shadow-lg"
              >
                🏰 Add Unit
              </button>
                            <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 
                          border-2 border-amber-500 rounded-lg font-bold text-amber-100
                          hover:from-amber-600 hover:to-amber-500 hover:scale-105 
                          transition-all duration-300 shadow-lg"
              >
                🏰 CREATE ARMY
              </button>
                </div>
            </div>

            {/* Available Units Grid */}
            {/* Available Units Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-300 mb-4">📦 Available Units</h3>
                <div className="overflow-x-auto scrollbar-thin scrollbar-track-amber-900/20 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/70">
                  <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                    {Object.values(units).map((unit) => (
                      <div
                        key={unit.id}
                        onClick={() => handleAddToArmy(unit)}
                        className="bg-gradient-to-br from-amber-100/90 to-amber-200/90 
                                  border rounded-lg p-2 cursor-pointer transition-all duration-300
                                  text-amber-900 shadow-sm text-xs flex-shrink-0 w-32
                                  border-amber-700/50 hover:shadow-md hover:border-amber-500 hover:scale-[1.02]">
                        
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-semibold leading-tight flex-1 text-xs">
                            {unit.player_name || `Unit #${unit.id}`}
                          </div>
                          <div className="text-sm ml-1">
                            {CLASS_ICONS[unit.unit_class as unknown as string] || '⚔️'}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1">
                            <span>⚔️</span>
                            <span>{unit.attack}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🛡️</span>
                            <span>{unit.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👟</span>
                            <span>{unit.speed}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{unit.special}</span>
                          </div>
                          <div className="text-xs text-amber-700 italic font-medium">
                            {unit.unit_class as unknown as string || 'Unknown'}
                          </div>
                        </div>
                        
                        <div className="text-xs text-amber-600 text-center font-medium">
                          ID: {unit.id}
                        </div>
                      </div>
                    ))}
                    
                    {/* Show message if no units */}
                    {Object.values(units).length === 0 && (
                      <div className="flex-shrink-0 w-64 text-center py-8 text-amber-400">
                        <div className="text-lg">📦</div>
                        <div className="text-amber-300 mt-2">No units available</div>
                        <div className="text-amber-500 text-sm mt-1">Create units to build your army</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* Current Armies */}
              <div>
                <h3 className="text-xl font-bold text-amber-300 mb-4">🏰 My Armies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(playerArmies).map((army) => (
                    <div key={army.army_id} 
                        onClick={() => handleArmyClick(army.army_id as number)}
                        className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 
                                  border-2 border-amber-600/50 rounded-xl p-4 backdrop-blur-sm
                                  hover:border-amber-500/70 transition-all duration-300 cursor-pointer
                                  hover:bg-amber-800/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-amber-300">
                          {army.name || `Army #${army.army_id}`}
                        </h4>
                        <div className="px-2 py-1 rounded-full text-xs font-medium border bg-amber-600/50 border-amber-400 text-amber-200">
                          READY
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-400">Army ID:</span>
                          <span className="text-amber-200 font-medium">#{army.army_id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-amber-400">Commander:</span>
                          <span className="text-amber-200 font-medium text-xs">
                            {army.commander_id.slice(0, 6)}...{army.commander_id.slice(-4)}
                          </span>
                        </div>

                        {/* Army completeness indicator */}
                        <div className="w-full bg-amber-900/60 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: '75%' }} // You can calculate this based on actual unit count later
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs text-amber-400">Click to select army</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show message if no armies */}
                  {Object.values(playerArmies).length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <div className="text-amber-400 text-lg">🏰</div>
                      <div className="text-amber-300 mt-2">No armies created yet</div>
                      <div className="text-amber-500 text-sm mt-1">Create your first army to get started</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Army Units */}
              {army_id > 0 && (
                <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-300 mb-4">⚔️ Army Units</h3>
                <div className="overflow-x-auto scrollbar-thin scrollbar-track-amber-900/20 scrollbar-thumb-amber-600/50 hover:scrollbar-thumb-amber-500/70">
                  <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                    {Object.values(playerArmyUnits).map((unit) => (
                      <div
                        key={unit.id}
                        onClick={() => console.log('Selected army unit:', unit)}
                        className="bg-gradient-to-br from-amber-100/90 to-amber-200/90 
                                  border rounded-lg p-2 cursor-pointer transition-all duration-300
                                  text-amber-900 shadow-sm text-xs flex-shrink-0 w-32
                                  border-amber-700/50 hover:shadow-md hover:border-amber-500 hover:scale-[1.02]">
                        
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-semibold leading-tight flex-1 text-xs">
                            {unit.player_name || `Unit #${unit.id}`}
                          </div>
                          <div className="text-sm ml-1">
                            {CLASS_ICONS[unit.unit_class as unknown as string] || '⚔️'}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1">
                            <span>⚔️</span>
                            <span>{unit.attack}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🛡️</span>
                            <span>{unit.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👟</span>
                            <span>{unit.speed}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{unit.special}</span>
                          </div>
                          <div className="text-xs text-amber-700 italic font-medium">
                            {unit.unit_class as unknown as string || 'Unknown'}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <div className="text-amber-600 font-medium">
                            Army: {army_id}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show message if no army units */}
                    {Object.values(playerArmyUnits).length === 0 && (
                      <div className="flex-shrink-0 w-64 text-center py-8 text-amber-400">
                        <div className="text-lg">⚔️</div>
                        <div className="text-amber-300 mt-2">No units in army</div>
                        <div className="text-amber-500 text-sm mt-1">Add units to your army to see them here</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            {/* Unit Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{Object.keys(units).length}</div>
                <div className="text-amber-200 text-sm">Total Units</div>
              </div>
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">{Object.keys(playerArmies).length}</div>
                <div className="text-amber-200 text-sm">Active Armies</div>
              </div>
              <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 text-center">
                <div className="text-2xl font-bold text-amber-300">6</div>
                <div className="text-amber-200 text-sm">Unit Classes</div>
              </div>

            </div>
          </div>
        )}
      </div>
      <CreateArmyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateArmy={handleCreateArmy}
      />
        <AddUnitModal
        isOpen={isModalOpenUnit}
        onClose={() => setIsModalOpenUnit(false)}
        onCreateUnit={handleCreateUnit}
      />
      <AddUnitToArmyModal
        isOpen={isModalOpenUnitArmy}
        onClose={() => setIsModalOpenUnitArmy(false)}
        onConfirm={handleConfirm}
      />
        <CreateBattleModal
        isOpen={isModalOpenBattle}
        onClose={() => setIsModalOpenBAttle(false)}
        onSelectArmy={handleCreateBattle}
        playerArmies={playerArmies}
      />
    </div>
  );
};

export default AshwoodMainMenu;