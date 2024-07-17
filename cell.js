function Cell(i, j, strokeCol, fillCol) {
  this.gridPos = createVector(i, j);
  this.pos = this.gridPos.copy().mult(cellSize);
  this.howManyCells = createVector(1, 1);
  this.strokeCol = strokeCol;
  this.fillCol = fillCol;
  this.type = null;
  this.canDelete = false;
  this.bgImage = null;
  this.preview = false;
  this.dir = "up"; // Default direction
  this.previousDir = "up";
  this.previousType = null;
  this.previousCanDelete = false;
  this.extractor = false;
  this.previousExtractor = false;
  this.occupied = false;
  this.isPartOfLargeCell = false;
  this.mainCell = null;
  this.intervalSet = false;
  this.extractInterval = null;

  this.draw = function () {
    stroke(this.strokeCol);
    fill(this.fillCol);
    
    if (this.preview) {
      tint(255, 127);
    } else {
      tint(255, 255);
    }
    
    push(); // Save the current drawing state
    translate(this.pos.x + (this.howManyCells.x * cellSize) / 2, this.pos.y + (this.howManyCells.y * cellSize) / 2); // Move to the cell center

    if (this.dir === "up") {
      rotate(0);
    } else if (this.dir === "right") {
      rotate(HALF_PI); // Rotate 90 degrees
    } else if (this.dir === "down") {
      rotate(PI); // Rotate 180 degrees
    } else if (this.dir === "left") {
      rotate(PI + HALF_PI); // Rotate 270 degrees
    }

    translate(-(this.howManyCells.x * cellSize) / 2, -(this.howManyCells.y * cellSize) / 2); // Move back to the top-left corner

    if (!this.bgImage) {
      rect(0, 0, this.howManyCells.x * cellSize, this.howManyCells.y * cellSize);
    } else {
      image(this.bgImage, 0, 0, this.howManyCells.x * cellSize, this.howManyCells.y * cellSize);
    }
    
    if (this.extractor) {
      image(extractorImg, 0, 0, this.howManyCells.x * cellSize, this.howManyCells.y * cellSize);
    }

    pop(); // Restore the previous drawing state
  };

  this.update = function () {
    if (this.type && !["center", "sphere", "color"].includes(this.type) || this.extractor) {
      this.canDelete = true;
    }
    if (!this.type && !this.extractor) {
      this.bgImage = null;
    } else if (this.type === "sphere") {
      this.bgImage = sphereMineralImg;
    } else if (this.type === "conveyor") {
      this.bgImage = conveyorBeltImg;
    }
    
    if (this.extractor && !this.preview) {
      var next;
      if (this.dir === "up") {
        if (this.gridPos.y - 1 >= 0) next = grid[this.gridPos.x][this.gridPos.y - 1];
      } else if (this.dir === "down") {
        if (this.gridPos.y + 1 < gridSize) next = grid[this.gridPos.x][this.gridPos.y + 1];
      } else if (this.dir === "right") {
        if (this.gridPos.x + 1 < gridSize) next = grid[this.gridPos.x + 1][this.gridPos.y];
      } else if (this.dir === "left") {
        if (this.gridPos.x - 1 >= 0) next = grid[this.gridPos.x - 1][this.gridPos.y];
      }
      
      if (next && next.type === "conveyor" && !this.intervalSet) {
        this.extractInterval = setInterval(() => {
          objects.push(new Extracted(this.gridPos.x, this.gridPos.y, "sphere"));
        }, 1000);
        this.intervalSet = true;
      }
        
    } else if (!this.extractor && this.intervalSet) {
      clearInterval(this.extractInterval);
      this.intervalSet = false;
      this.extractInterval = null;
    }
    
    if (this.isPartOfLargeCell && this !== this.mainCell) {
      this.strokeCol = this.mainCell.strokeCol;
      this.fillCol = this.mainCell.fillCol;
      this.type = this.mainCell.type;
      this.canDelete = this.mainCell.canDelete;
      this.bgImage = this.mainCell.bgImage;
      this.preview = this.mainCell.preview;
      this.dir = this.mainCell.dir; // Default direction
      this.previousDir = this.mainCell.previousDir;
      this.previousType = this.mainCell.previousType;
      this.previousCanDelete = this.mainCell.previousCanDelete;
    }
  };

  this.getNeighbors = function () {
    var neighbors = [];
    for (var x = -1; x <= 1; x++) {
      for (var y = -1; y <= 1; y++) {
        if ((x !== 0 || y !== 0) && 
            this.gridPos.x + x >= 0 && this.gridPos.x + x < gridSize && 
            this.gridPos.y + y >= 0 && this.gridPos.y + y < gridSize) {
          neighbors.push(grid[this.gridPos.x + x][this.gridPos.y + y]);
        }
      }
    }
    return neighbors;
  };
}
