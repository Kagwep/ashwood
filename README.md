# 🌲 Ashwood - Tactical Battlefield Strategy Game

**A fully onchain tactical strategy game built on Dojo framework**

Ashwood combines tactical unit positioning, seasonal warfare mechanics, and supply chain logistics in an immersive 54-position battlefield system. Players deploy armies, manage resources, and engage in strategic combat across multiple interconnected 3x3 grids.

---

## 🎮 Game Overview

### Core Concept
Players command armies of diverse unit types across a 54-position battlefield divided into 6 tactical zones. Each battle is influenced by seasonal effects, supply chain requirements, and unit-specific movement patterns.

### Key Features
- **6 Unit Classes** with unique abilities and movement patterns
- **Seasonal Combat System** with dynamic stat modifications
- **Supply Chain Mechanics** requiring tactical positioning
- **Turn-Based Strategy** with deployment and engagement phases
- **Fully Onchain** built on Dojo framework
- **NFT Competition** - 72 unique units minted as NFTs

---

## 🏆 Competition System

### Battle Competition
- **72 Unique Units** - Each unit is minted as an NFT
- **120 Round Battles** - Players compete for high scores over 120 rounds
- **Winner Takes All** - Highest scoring player claims ownership of the unit being competed for
- **Strategic Choice** - Players can choose which unit to battle for

### How to Win
- Score the highest points after 120 rounds of tactical combat
- Claim ownership of the NFT unit you competed for
- Build your collection through strategic victories

---

## 🗺️ Battlefield Layout

```
🏔️ ATTACKING TERRITORY (Positions 1-27)
┌─────────────┬─────────────┬─────────────┐
│ Northern    │ Eastern     │ Central     │
│ Front       │ Theater     │ Command     │
│ 1  2  3     │ 10 11 12    │ 19 20 21    │
│ 4  5  6     │ 13 14 15    │ 22 23 24    │
│ 7  8  9     │ 16 17 18    │ 25 26 27    │
└─────────────┴─────────────┴─────────────┘

🏰 DEFENDING TERRITORY (Positions 28-54)
┌─────────────┬─────────────┬─────────────┐
│ Western     │ Southern    │ Reserve     │
│ Flank       │ Defense     │ Forces      │
│ 28 29 30    │ 37 38 39    │ 46 47 48    │
│ 31 32 33    │ 40 41 42    │ 49 50 51    │
│ 34 35 36    │ 43 44 45    │ 52 53 54    │
└─────────────┴─────────────┴─────────────┘
```

---

## ⚔️ Unit Classes

### 🪖 Infantry
- **Movement**: 1 tile orthogonal
- **Role**: Versatile foot soldiers
- **Seasonal**: Struggles in winter, steady in other seasons

### 🔱 Pike
- **Movement**: 1 tile forward only
- **Role**: Spear formation units
- **Seasonal**: Defensive powerhouse in winter

### 🏹 Archer
- **Movement**: 1 tile orthogonal
- **Role**: Ranged combat specialists
- **Seasonal**: Dominates summer conditions

### 🐎 Cavalry
- **Movement**: Exactly 2 tiles orthogonal (no jumping)
- **Role**: Fast strike force
- **Seasonal**: Powerful in summer, nearly useless in winter

### ⭐ Elite
- **Movement**: 1-2 tiles any direction
- **Role**: Versatile hero units
- **Seasonal**: Adaptable across all seasons

### 🏴 Support
- **Movement**: 1 tile any direction
- **Role**: Battlefield assistance and healing
- **Seasonal**: Essential in harsh conditions

---

## 🌦️ Seasonal Effects System

### ❄️ Winter (Odd Positions)
*Cold, harsh, icy terrain*

| Unit Class | Stat Changes | Notes |
|-----------|-------------|--------|
| Infantry | speed -2 | Difficult marching |
| Pike | attack +1, defense +2 | Strong defensive formation |
| Archer | attack -1, special -1 | Reduced effectiveness |
| Cavalry | attack -1, speed -3 | Nearly unusable |
| Elite | attack +2, defense -1 | Veterans adapt |
| Support | defense +1, special +1 | More needed |

### ☀️ Summer (Even Positions)
*Warm, dry, fast-paced combat*

| Unit Class | Stat Changes | Notes |
|-----------|-------------|--------|
| Infantry | speed +1 | Better mobility |
| Pike | attack +3 | Enhanced formation |
| Archer | attack +3, special +1 | Ideal conditions |
| Cavalry | attack +1, speed +2 | Perfect for charges |
| Elite | all stats +1 | Peak performance |
| Support | special -1 | Less critical |

### 🍂 Autumn (Prime Positions)
*Muddy, shifting terrain*

| Unit Class | Stat Changes | Notes |
|-----------|-------------|--------|
| Infantry | defense +1 | Steady in mud |
| Pike | speed -1 | Slower formation |
| Archer | attack +1 | Good visibility |
| Cavalry | attack -1, speed -2 | Slippery terrain |
| Elite | special +2 | Strategic advantage |
| Support | speed +1 | Better positioning |

---

## 🔗 Supply Chain System

### Deployment Rules
1. **First Deployment**: Must be on baseline positions
   - **Attackers**: 1,2,3 | 10,11,12 | 19,20,21
   - **Defenders**: 34,35,36 | 43,44,45 | 52,53,54

2. **Middle Control**: Control middle positions for free deployment
   - **Attacker middles**: 5, 14, 23
   - **Defender middles**: 32, 41, 50

3. **Adjacency Requirements**: Units must maintain connections
   - **Horizontal neighbors** within same 3x3 grid
   - **Diagonal connections** for tactical flexibility

4. **Border Breach**: Special rules for crossing territory lines (27 ↔ 28)

---

## 🎯 Gameplay Flow

### 1. Pre-Battle Setup
- Create armies and assign units
- Choose deployment strategy based on expected season
- Plan formation and unit positioning

### 2. Deployment Phase
- Deploy units following supply chain rules
- Establish forward positions and supply lines
- Secure middle control positions

### 3. Combat Phase
- Move units according to class restrictions
- Engage enemy forces with tactical positioning
- Adapt to seasonal effects and terrain

### 4. Victory Conditions
- Score the highest points after 120 rounds
- Eliminate enemy forces
- Control strategic positions
- Force enemy retreat

---

## 🛠️ Technical Stack

- **Framework**: Dojo (Fully Onchain)
- **Language**: Cairo
- **Architecture**: Entity Component System (ECS)
- **Frontend**: React/TypeScript

### Key Features
- **Gas Optimized**: Efficient position validation and movement
- **Modular Design**: Separate contracts for different game aspects
- **Event Driven**: Comprehensive battle logging
- **Upgradeable**: Modular contract architecture

---

## 🚀 Getting Started

### Play Live
🎮 **Live Game**: [https://ashwood.vercel.app/](https://ashwood.vercel.app/)

### Local Development
```bash
# Clone the repository
git clone https://github.com/Kagwep/ashwood.git
cd ashwood

# Deploy client
cd client
npm run dev

# Deploy contracts on Katana (in separate terminal)
cd contracts/ashwood
# Follow Dojo deployment instructions
```

---

## 🎮 Strategy Tips

### Army Composition
- **Balanced Forces**: Mix unit types for seasonal adaptability
- **Specialized Armies**: Risk/reward for specific seasons
- **Support Ratios**: Don't neglect support units

### Tactical Positioning
- **Supply Lines**: Maintain connected formations
- **Middle Control**: Priority for deployment flexibility
- **Border Pressure**: Contest territory boundaries

### Seasonal Planning
- **Winter**: Focus on Pike and Support units
- **Summer**: Leverage Archer and Cavalry advantages
- **Autumn**: Elite units gain strategic value

### NFT Competition Strategy
- **Choose Wisely**: Select units you want to own
- **Long-term Thinking**: Plan for 120-round campaigns
- **Risk Management**: Balance aggressive plays with consistency

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Areas
- New unit classes and abilities
- Additional seasonal effects
- Enhanced battlefield mechanics
- UI/UX improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Game**: [https://ashwood.vercel.app/](https://ashwood.vercel.app/)
- **Repository**: [https://github.com/Kagwep/ashwood.git](https://github.com/Kagwep/ashwood.git)
<!-- - **Documentation**: [docs.ashwood.game](https://docs.ashwood.game)
- **Discord**: [Join our community](https://discord.gg/ashwood)
- **Twitter**: [@AshwoodGame](https://twitter.com/AshwoodGame) -->

---

**Built with ⚔️ for tactical strategy enthusiasts and onchain gamers**