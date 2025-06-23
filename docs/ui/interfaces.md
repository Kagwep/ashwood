# 🖥️ Interface Summary

**Core interface windows in the Ashwood tactical strategy game**

This document describes each distinct window/screen that players encounter while commanding their armies in Ashwood.

---

## 🏰 Main Menu Screen
**Purpose:** Game entry point and introduction

**Layout:**
- Large "Ashwood" title with crossed swords logo
- Descriptive subtitle about tactical strategy and 54-position battlefield
- Central "CONTINUE TO GAME" button
- Bottom navigation: TACTICAL | STRATEGIC | ONCHAIN

**Visual Style:** Clean, centered design with warm background and golden text

---

## 🎯 Command Center Dashboard
**Purpose:** Primary hub for army and battle management

**Layout:**
- Header: "ASHWOOD COMMAND CENTER" with navigation (Battles | Units | Wallet)
- Left Panel: "Unit Barracks" and "Available Units" sections
- Right Panel: "CREATE ARMY" and "Add Unit" buttons
- Bottom Panel: "My Armies" section with army statistics
- Footer Stats: Total Units (0) | Active Armies (0) | Unit Classes (6)

**Key Features:** Empty state messaging for new players, clear call-to-action buttons

---

## ⚔️ Battle Lobby Screen
**Purpose:** View and join active battles

**Layout:**
- Header: "ASHWOOD COMMAND CENTER" with same navigation
- Main Section: "Active Battlefields" with table headers:
  - Battle Name | Host | Status | Players | Difficulty | Reward | Action
- Right Side: "CREATE BATTLE" button
- Empty State: Clean table waiting for active battles

**Functionality:** Battle browsing and creation interface

---

## 🌍 Realm Selection Screen
**Purpose:** Choose battlefield realm and game mode

**Layout:**
- Header: "SELECT YOUR BATTLEFIELD REALM"
- Three Realm Cards:
  - **MAINNET - Elite Battleground** (Trophy icon, "DEPLOY FORCES", Currently Sealed)
  - **SEPOLIA - Training Grounds** (Medal icon, "ENTER BATTLE")  
  - **KATANA - Practice Arena** (Sword icon, "BEGIN TRAINING")
- Bottom: TACTICAL | STRATEGIC | ONCHAIN navigation

**Visual Design:** Three distinct cards with unique icons and descriptions for each network

---

## 🎮 Battle Introduction Screen
**Purpose:** Welcome and tutorial introduction

**Layout:**
- Central welcome text explaining the commander role
- Mission description: 54-position battlefield mastery
- Tactical grid visualization (3x3 grid icons)
- "TACTICAL OVERVIEW: BATTLEFIELD GRID SYSTEM" label
- "KATANA" network indicator
- Large "ENTER THE BATTLEFIELD" button

**Purpose:** Onboarding and game concept explanation

---

## ⚡ Active Battle Screen
**Purpose:** Live tactical combat interface

**Layout:**
- **Left Sidebar:**
  - Army counter (16/54 positions)
  - "Opponents Turn" indicator
  - Round tracker
  
- **Center:** 6 Battlefield zones in 2x3 grid:
  - **Top Row:** Battlefield 1-9 (INVADER ZONE) | 10-18 (INVADER ZONE) | 19-27 (INVADER ZONE)
  - **Bottom Row:** Battlefield 28-36 (DEFENDER ZONE) | 37-45 (DEFENDER ZONE) | 46-54 (DEFENDER ZONE)
  - Unit cards displayed in occupied positions
  - Units: 2/9 counter for each zone

- **Right Sidebar:**
  - Turn indicator (Turn 19 - Prime Season, 6 turns left)
  - Unit class indicator (Knight)
  - "COMBAT MODE" toggle
  - "Exit Combat" button
  - "End Turn" button
  - "Ready Battle" button
  - Score display (You: 0 Opp: 1)

**Visual Elements:** 
- Unit cards show class icons and stats (colored squares for attack/defense/speed/special)
- Zone headers clearly mark INVADER vs DEFENDER territories
- Position numbers visible in each battlefield grid square

---

