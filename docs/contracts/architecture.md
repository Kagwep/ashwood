# 🏗️ Architecture Summary

**Ashwood's fully onchain architecture built on Dojo framework**

This document outlines the structural composition of smart contracts, data models, and event systems that form Ashwood's tactical strategy game.

---

## 🌍 World Contract Structure

**Core Architecture:** Dojo World Pattern

The World contract follows Dojo's Entity Component System (ECS) architecture:

```
World Contract
├── Resource Management
│   ├── Models (Data Components)
│   ├── Events (Game Events)
│   ├── Contracts (System Logic)
│   └── Libraries (Shared Code)
├── Entity Storage
│   ├── Entity Creation/Deletion
│   ├── Component Assignment
│   └── Query Systems
└── Permission Layer
    ├── Owner Controls
    ├── Writer Permissions
    └── Upgrade Management
```

---

## 📋 System Contract Architecture

### Contract Composition Pattern

Each system contract implements:

```
System Contract
├── Core Interfaces
│   ├── IContract (Dojo Standard)
│   ├── IDeployedResource (Metadata)
│   └── Custom Interface (Game Logic)
├── Implementation Layer
│   ├── Business Logic Functions
│   ├── State Validation
│   └── Event Emission
└── Infrastructure
    ├── World Provider (Context)
    ├── Upgradeable Pattern
    └── Constructor Setup
```

### ⚔️ Actions System Structure
```
Actions Contract
├── Combat Functions
│   ├── move_unit(battlefield_id, army_id, unit_id, from, to)
│   ├── attack_unit(battlefield_id, attacker_id, target_id)
│   └── retreat_unit(battlefield_id, army_id, unit_id)
├── Validation Layer
│   ├── Position Validation
│   ├── Turn Verification
│   └── Permission Checks
└── State Updates
    ├── Position Changes
    ├── Combat Results
    └── Event Emissions
```

### 🛡️ Armies System Structure
```
Armies Contract
├── Army Management
│   ├── create_army(army_id, name)
│   ├── rename_army(army_id, new_name)
│   └── Army Lifecycle
├── Unit Assignment
│   ├── add_unit_to_army(army_id, unit_id)
│   ├── remove_unit_from_army(army_id, unit_id)
│   └── Composition Rules
└── Turn Tracking
    ├── mark_unit_used(army_id, battlefield_id, unit_id, turn)
    ├── is_unit_used_this_turn(...)
    └── Usage Validation
```

### 🏟️ Battlefields System Structure
```
Battlefields Contract
├── Battle Lifecycle
│   ├── create_battle(battlefield_id, invader_army_id, name)
│   ├── join_battle(battlefield_id, army_id)
│   └── start_battle(battlefield_id)
├── Deployment System
│   ├── deploy_unit_to_battlefield(battlefield_id, army_id, unit_id, position)
│   ├── Position Validation
│   └── Supply Chain Rules
└── State Management
    ├── Battle Status Tracking
    ├── Player Management
    └── Turn Progression
```

### 🪖 Units System Structure
```
Units Contract
├── Unit Creation
│   ├── create_unit(id, player_name, class, stats...)
│   ├── Class Validation
│   └── Stat Assignment
├── Unit Management
│   ├── update_unit_stats(id, attack, defense, speed, special)
│   ├── Stat Validation
│   └── Change Tracking
└── Utility Functions
    ├── check_advantage(attacker_id, target_id)
    ├── is_ranged(id)
    └── can_support(id)
```

---

## 📊 Data Model Structures

### Entity-Component Design

```
Data Models (Components)
├── Core Entities
│   ├── Army { commander_id, army_id, name }
│   ├── Unit { id, player_name, class, stats }
│   └── BattleField { match_id, players, status, turn }
├── Relational Components
│   ├── ArmyUnitPosition { army_id, unit_id, position }
│   ├── ArmyUnitUsed { army_id, battlefield_id, unit_id, turn }
│   └── BattleFieldPosition { battlefield_id, position, unit_id }
└── Contextual Components
    ├── BattleZone { zone_id, type, control_status }
    └── BattlefieldStats { battlefield_id, metrics }
```

### Model Composition Pattern

Each model follows:
```
Model Structure
├── Unique Selector (felt252 hash)
├── Class Hash (Cairo bytecode)
├── Member Fields
│   ├── Primary Keys
│   ├── Data Fields
│   └── Relationship Fields
└── Storage Layout
    ├── Fixed Layout (primitives)
    ├── Struct Layout (composite)
    └── Array Layout (collections)
```

---

## 📡 Event System Architecture

### Event Categories

```
Event System
├── Entity Lifecycle Events
│   ├── ArmyCreated
│   ├── UnitCreated
│   └── BattleCreated
├── Action Events
│   ├── UnitMoved
│   ├── UnitAttacked
│   ├── UnitDeployed
│   └── UnitDeployedToBattle
├── State Change Events
│   ├── UnitStatsUpdated
│   ├── UnitEngagement
│   └── CombatCalculated
└── System Events
    ├── Contract Upgrades
    ├── Permission Changes
    └── World Updates
```

### Event Structure Pattern

```
Event Composition
├── Event Metadata
│   ├── Unique Selector
│   ├── Class Hash
│   └── Event Tag
├── Data Fields
│   ├── Key Fields (indexed)
│   ├── Data Fields (values)
│   └── Nested Structures
└── Emission Context
    ├── Emitting Contract
    ├── Transaction Context
    └── Block Information
```

---

## 🔄 System Interaction Patterns

### Contract Communication

```
Inter-Contract Flow
├── World as Message Router
│   ├── Permission Validation
│   ├── State Coordination
│   └── Event Aggregation
├── Direct Contract Calls
│   ├── Function Invocation
│   ├── Return Value Handling
│   └── Error Propagation
└── Event-Driven Updates
    ├── Event Emission
    ├── Event Listening
    └── State Synchronization
```

### Data Flow Architecture

```
Data Flow Pattern
├── Input Validation
│   ├── Parameter Checking
│   ├── Permission Verification
│   └── State Validation
├── Business Logic
│   ├── Game Rule Enforcement
│   ├── State Calculations
│   └── Effect Application
├── State Updates
│   ├── Model Updates
│   ├── Relationship Changes
│   └── Index Maintenance
└── Event Emission
    ├── Change Notifications
    ├── Action Confirmations
    └── Error Reports
```

---

