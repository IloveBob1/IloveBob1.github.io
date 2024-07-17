function Extracted(i, j, type) {
  this.gridPos = createVector(i, j)
  this.pos = this.gridPos.copy().mult(cellSize)
  this.type = type
  
  this.draw = function() {
    if (this.type === "sphere") {
      image(sphereImg, this.pos.x + offsetX, this.pos.y + offsetY)
    }
  }
  
  this.move = function() {
   let currentCell = grid[this.gridPos.x][this.gridPos.y];
   if (["conveyor", "center"].includes(currentCell.type) || currentCell.extractor) {
      var dir = grid[this.gridPos.x][this.gridPos.y].dir;
      var next;

      if (dir === "up") {
        if (this.gridPos.y - 1 >= 0) next = grid[this.gridPos.x][this.gridPos.y - 1];
      } else if (dir === "down") {
        if (this.gridPos.y + 1 < gridSize) next = grid[this.gridPos.x][this.gridPos.y + 1];
      } else if (dir === "right") {
        if (this.gridPos.x + 1 < gridSize) next = grid[this.gridPos.x + 1][this.gridPos.y];
      } else if (dir === "left") {
        if (this.gridPos.x - 1 >= 0) next = grid[this.gridPos.x - 1][this.gridPos.y];
      }

      if (!next || next.occupied || !(next.type === "conveyor" || next.type === "center") || next.preview) {
        grid[this.gridPos.x][this.gridPos.y].occupied = true;
      } else if (next.type === "conveyor" && !next.preview) {
        grid[this.gridPos.x][this.gridPos.y].occupied = false;
        this.gridPos = next.gridPos.copy();
        this.pos = this.gridPos.copy().mult(cellSize);
      } else if (next.isPartOfLargeCell && next.type === "center") {
        level.count++
        grid[this.gridPos.x][this.gridPos.y].occupied = false;
        objects.splice(objects.indexOf(this), 1);
      }
    } else {
      grid[this.gridPos.x][this.gridPos.y].occupied = false;
      objects.splice(objects.indexOf(this), 1)
    }
  }
}
