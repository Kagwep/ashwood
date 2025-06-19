// Cavalry Engagement Functions

// Helper function to determine unit ownership
const getUnitOwnership = (globalPosition: number) => {
  // Positions 1-27 belong to Player 1, positions 28-54 belong to Player 2
  return globalPosition <= 27 ? 1 : 2;
};

// Convert global position to battlefield coordinates
const getCoordinates = (globalPosition: number) => {
  const adjustedPos = globalPosition - 1; // Convert to 0-based
  const battlefieldId = Math.floor(adjustedPos / 9);
  const localPosition = adjustedPos % 9;
  const row = Math.floor(localPosition / 3);
  const col = localPosition % 3;
  
  return { battlefieldId, row, col, localPosition };
};

// Convert battlefield coordinates back to global position
const getGlobalPosition = (battlefieldId: number, row: number, col: number) => {
  const localPosition = row * 3 + col;
  return battlefieldId * 9 + localPosition + 1; // Convert back to 1-based
};

// Check if position is within battlefield bounds
const isValidPosition = (battlefieldId: number, row: number, col: number) => {
  return battlefieldId >= 0 && battlefieldId < 6 && 
         row >= 0 && row < 3 && 
         col >= 0 && col < 3;
};

// Get all positions in a straight line (8 directions including diagonals)
const getDirectionalMoves = (fromPos: number, direction: string, maxDistance = 2) => {
  const directions = {
    'north': [-1, 0],
    'northeast': [-1, 1],
    'east': [0, 1],
    'southeast': [1, 1],
    'south': [1, 0],
    'southwest': [1, -1],
    'west': [0, -1],
    'northwest': [-1, -1]
  };
  
  const [dRow, dCol] = directions[direction as keyof  {
    north: number[];
    northeast: number[];
    east: number[];
    southeast: number[];
    south: number[];
    southwest: number[];
    west: number[];
    northwest: number[];
}];
  const { battlefieldId, row, col } = getCoordinates(fromPos);
  const positions = [];
  
  for (let i = 1; i <= maxDistance; i++) {
    const newRow = row + (dRow * i);
    const newCol = col + (dCol * i);
    
    // Check bounds - cavalry can move across battlefields in straight lines
    if (newRow < 0 || newRow >= 3 || newCol < 0 || newCol >= 3) {
      // Try to continue on adjacent battlefield if moving in straight line
      const newBattlefieldId = calculateAdjacentBattlefield(battlefieldId, dRow, dCol, i);
      if (newBattlefieldId !== -1) {
        const adjustedRow = ((newRow % 3) + 3) % 3;
        const adjustedCol = ((newCol % 3) + 3) % 3;
        const globalPos = getGlobalPosition(newBattlefieldId, adjustedRow, adjustedCol);
        positions.push(globalPos);
      }
      break;
    }
    
    const globalPos = getGlobalPosition(battlefieldId, newRow, newCol);
    positions.push(globalPos);
  }
  
  return positions;
};

// Calculate adjacent battlefield when moving across borders
const calculateAdjacentBattlefield = (currentBattlefield: number, dRow: number, dCol: number, step: number) => {
  // Battlefield layout (0-5):
  // 0  1  2
  // 3  4  5
  
  const battlefieldRow = Math.floor(currentBattlefield / 3);
  const battlefieldCol = currentBattlefield % 3;
  
  // Calculate new battlefield position
  let newBattlefieldRow = battlefieldRow;
  let newBattlefieldCol = battlefieldCol;
  
  // Moving vertically between battlefield rows
  if (dRow !== 0) {
    newBattlefieldRow += dRow > 0 ? 1 : -1;
  }
  
  // Moving horizontally between battlefield columns
  if (dCol !== 0) {
    newBattlefieldCol += dCol > 0 ? 1 : -1;
  }
  
  // Check if new battlefield is valid
  if (newBattlefieldRow >= 0 && newBattlefieldRow < 2 && 
      newBattlefieldCol >= 0 && newBattlefieldCol < 3) {
    return newBattlefieldRow * 3 + newBattlefieldCol;
  }
  
  return -1; // Invalid battlefield
};

// Validate cavalry movement path
const validateCavalryMovement = (battlefields: any[][], fromPos: number, toPos: number) => {
  const fromCoords = getCoordinates(fromPos);
  const toCoords = getCoordinates(toPos);
  
  // Check if movement is in straight line (including diagonals)
  const rowDiff = toCoords.row - fromCoords.row;
  const colDiff = toCoords.col - fromCoords.col;
  const battlefieldDiff = toCoords.battlefieldId - fromCoords.battlefieldId;
  
  // Determine if movement is in straight line
  const isHorizontal = rowDiff === 0 && battlefieldDiff === 0;
  const isVertical = colDiff === 0 && battlefieldDiff === 0;
  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff) && battlefieldDiff === 0;
  const isCrossBattlefield = battlefieldDiff !== 0;
  
  if (!isHorizontal && !isVertical && !isDiagonal && !isCrossBattlefield) {
    return { valid: false, reason: 'Cavalry must move in straight lines (including diagonals)' };
  }
  
  // Calculate distance
  const distance = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + Math.abs(battlefieldDiff) * 3;
  
  if (distance > 2) {
    return { valid: false, reason: 'Cavalry can only move up to 2 squares' };
  }
  
  // Check path is clear (no friendly or enemy units blocking)
  const path = getPathBetweenPositions(fromPos, toPos);
  
  for (const pos of path) {
    const coords = getCoordinates(pos);
    const slot = battlefields[coords.battlefieldId][coords.localPosition];
    
    if (slot && slot.card && pos !== toPos) {
      return { valid: false, reason: 'Path is blocked by another unit' };
    }
  }
  
  return { valid: true };
};

// Get all positions between two points (for path checking)
const getPathBetweenPositions = (fromPos: number, toPos: number) => {
  const fromCoords = getCoordinates(fromPos);
  const toCoords = getCoordinates(toPos);
  
  const path = [];
  const steps = Math.max(
    Math.abs(toCoords.row - fromCoords.row),
    Math.abs(toCoords.col - fromCoords.col),
    Math.abs(toCoords.battlefieldId - fromCoords.battlefieldId)
  );
  
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const interpolatedRow = Math.round(fromCoords.row + (toCoords.row - fromCoords.row) * progress);
    const interpolatedCol = Math.round(fromCoords.col + (toCoords.col - fromCoords.col) * progress);
    const interpolatedBattlefield = fromCoords.battlefieldId; // Simplified for same battlefield
    
    if (isValidPosition(interpolatedBattlefield, interpolatedRow, interpolatedCol)) {
      const globalPos = getGlobalPosition(interpolatedBattlefield, interpolatedRow, interpolatedCol);
      path.push(globalPos);
    }
  }
  
  return path;
};

// Check if cavalry can attack target position
const canCavalryAttack = (battlefields: any[][], cavalryPos: number, targetPos: number) => {
  // Validate movement to target position
  const movementCheck = validateCavalryMovement(battlefields, cavalryPos, targetPos);
  
  if (!movementCheck.valid) {
    return { canAttack: false, reason: movementCheck.reason };
  }
  
  // Check if target position has an enemy unit
  const targetCoords = getCoordinates(targetPos);
  const targetSlot = battlefields[targetCoords.battlefieldId][targetCoords.localPosition];
  
  if (!targetSlot || !targetSlot.card) {
    return { canAttack: false, reason: 'No unit at target position' };
  }
  
  // Check if target is enemy unit (different ownership)
  const cavalryOwner = getUnitOwnership(cavalryPos);
  const targetOwner = getUnitOwnership(targetPos);
  
  if (cavalryOwner === targetOwner) {
    return { canAttack: false, reason: 'Cannot attack friendly units' };
  }
  
  return { canAttack: true };
};

// Get all valid cavalry moves from current position
const getCavalryValidMoves = (battlefields: any[][], cavalryPos: number) => {
  const validMoves = [];
  const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  
  for (const direction of directions) {
    const positions = getDirectionalMoves(cavalryPos, direction, 2);
    
    for (const pos of positions) {
      const movementCheck = validateCavalryMovement(battlefields, cavalryPos, pos);
      
      if (movementCheck.valid) {
        const coords = getCoordinates(pos);
        const slot = battlefields[coords.battlefieldId][coords.localPosition];
        
        // Can move to empty squares or attack enemy units
        if (!slot || !slot.card) {
          validMoves.push({ position: pos, type: 'move' });
        } else {
          const cavalryOwner = getUnitOwnership(cavalryPos);
          const targetOwner = getUnitOwnership(pos);
          
          if (cavalryOwner !== targetOwner) {
            validMoves.push({ position: pos, type: 'attack' });
          }
        }
      }
    }
  }
  
  return validMoves;
};

// Execute cavalry movement/attack
const executeCavalryAction = (battlefields: any[][], fromPos: any, toPos: number) => {
  const attackCheck = canCavalryAttack(battlefields, fromPos, toPos);
  
  if (attackCheck.canAttack) {
    // Combat resolution would happen here
    return {
      success: true,
      action: 'attack',
      message: `Cavalry charges and attacks unit at position ${toPos}!`
    };
  } else {
    // Check if it's a valid move to empty space
    const movementCheck = validateCavalryMovement(battlefields, fromPos, toPos);
    
    if (movementCheck.valid) {
      const toCoords = getCoordinates(toPos);
      const targetSlot = battlefields[toCoords.battlefieldId][toCoords.localPosition];
      
      if (!targetSlot || !targetSlot.card) {
        return {
          success: true,
          action: 'move',
          message: `Cavalry moves to position ${toPos}`
        };
      }
    }
  }
  
  return {
    success: false,
    action: 'none',
    message: 'Invalid cavalry action'
  };
};

// Export all functions
export {
  getUnitOwnership,
  getCoordinates,
  getGlobalPosition,
  isValidPosition,
  getDirectionalMoves,
  validateCavalryMovement,
  canCavalryAttack,
  getCavalryValidMoves,
  executeCavalryAction,
  getPathBetweenPositions
};