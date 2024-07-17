function getCellIndex(x, y) {
  let i = floor((x - offsetX) / cellSize);
  let j = floor((y - offsetY) / cellSize);
  if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
    return [i, j];
  } else {
    return null;
  }
}

function getNextLevel() {
  let k = 20;
  let a = 1.5;
  let b = 10;
  
  let nextLevel = currentLevel + k * Math.pow(1 + currentLevel / b, a);
  return Math.floor(nextLevel); // Use Math.floor to round down to the nearest integer
}

function generateMineral(mineralType, iter, gridX, gridY) {
  var list = [grid[gridX][gridY]];
  var processed = new Set();

  for (var i = 0; i < iter; i++) {
    var newNeighbors = [];

    for (var lI = 0; lI < list.length; lI++) {
      var current = list[lI];
      var neighbors = current.getNeighbors();

      neighbors.forEach((neighbor) => {
        if (neighbor.type === null && !processed.has(neighbor)) {
          if (i === iter - 1) {
            if (random() > 0.6) {
              neighbor.type = mineralType;
              newNeighbors.push(neighbor);
              processed.add(neighbor);
            }
          } else {
            neighbor.type = mineralType;
            newNeighbors.push(neighbor);
            processed.add(neighbor);
          }
        }
      });
    }
    list = newNeighbors;
  }
}

function createLargeCell(centerCell) {
  for (var i = -floor(centerCell.howManyCells.x/2); i <= floor(centerCell.howManyCells.x/2); i++) {
    for (var j = -floor(centerCell.howManyCells.y/2); j <= floor(centerCell.howManyCells.y/2); j++) {
      if (centerCell.gridPos.x+i < gridSize && centerCell.gridPos.x+i >= 0 && centerCell.gridPos.y+j < gridSize && centerCell.gridPos.y+j >= 0) {
        grid[centerCell.gridPos.x+i][centerCell.gridPos.y+j].isPartOfLargeCell = true
        grid[centerCell.gridPos.x+i][centerCell.gridPos.y+j].mainCell = centerCell
      }
    }
  }
}

function mouseOverUI() {
  for (var i = 0; i < UIElements.length; i++) {
    if (UIElements[i].hovered) {
      return true;
    }
  }
}
