var gridSize = 70;
var cellSize = 35;
var grid = [];
var offsetX = 0;
var offsetY = 0;
var sphereMineralImg;
var conveyorBeltImg;
var extractorImg;
var sphereImg;
var UIElements = [];
var isClicking = false;
var isRightClicking = false;
var isClickingUI = false;
var isRightClickingUI = false;
var currentSelected = null;
var currRot = "up"
var objects = []
var level;
var currentLevel = 1;


function preload() {
  try {
    sphereMineralImg = loadImage("sphereMineral.png");
    conveyorBeltImg = loadImage("conveyorBelt.jfif");
    extractorImg = loadImage("extractor.png");
    sphereImg = loadImage("sphere.png");
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

function setup() {
  colorMode(RGB);
  let canvas = createCanvas(600, 600);
  sphereImg.resize(cellSize, cellSize);
  
  // Add event listener to disable the context menu on right-click
  canvas.elt.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  
  for (var i = 0; i < gridSize; i++) {
    var tempGrid = [];
    for (var j = 0; j < gridSize; j++) {
      tempGrid.push(new Cell(i, j, color(0), color(220)));
    }
    grid.push(tempGrid);
  }

  offsetX = -gridSize * cellSize / 2;
  offsetY = -gridSize * cellSize / 2;

  let middleIndex = getCellIndex(width / 2 - 50, height / 2 - 50);
  if (middleIndex) {
    var largeCell = new Cell(middleIndex[0], middleIndex[1], color(0), color(50));
    largeCell.howManyCells = createVector(3, 3);
    largeCell.type = "center";
    createLargeCell(largeCell);
    level = new Level(largeCell.pos.x, largeCell.pos.y, 20, "sphere", sphereImg, 75, 75)
  }

  for (var i = 0; i < 5; i++) {
    generateMineral("sphere", 3,floor(random(0, gridSize)), floor(random(0, gridSize)));
  }

  UIElements.push(new UIElement(25, height - 75, 50, 50, "conveyor", conveyorBeltImg, "Conveyor Belt"));
  UIElements.push(new UIElement(110, height - 75, 50, 50, "extractor", extractorImg, "Extractor"));
}

function draw() {
  background(220);
  stroke(0, 0, 0, 255);
  fill(0, 0, 0, 255);

  offsetX = constrain(offsetX, -(gridSize * cellSize - height), 50);
  offsetY = constrain(offsetY, -(gridSize * cellSize - width), 50);

  push();
  translate(offsetX, offsetY);
  
  let startX = max(0, floor(-offsetX / cellSize));
  let endX = min(gridSize, ceil((width - offsetX) / cellSize));
  let startY = max(0, floor(-offsetY / cellSize));
  let endY = min(gridSize, ceil((height - offsetY) / cellSize));

  for (var i = startX; i < endX; i++) {
    for (var j = startY; j < endY; j++) {
      let cell = grid[i][j];
      cell.update();
      cell.draw();
      
      let mouseIndex = getCellIndex(mouseX, mouseY);
      if (mouseIndex) {
        if (grid[i][j].preview === true && (mouseIndex[0] !== i || mouseIndex[1] !== j)) {
          if (grid[i][j].previousType) {
            grid[i][j].type = grid[i][j].previousType;
            grid[i][j].previousType = null;
            grid[i][j].canDelete = grid[i][j].previousCanDelete;
            grid[i][j].previousCanDelete = false;
            grid[i][j].dir = grid[i][j].previousDir
          } else {
            grid[i][j].type = null;
          }
          grid[i][j].extractor = grid[i][j].previousExtractor;
          grid[i][j].previousExtractor = false;
          grid[i][j].preview = false;
        }
      }
    }
  }
  
  level.draw()
  if (level.count >= level.total) {
    level.count = 0;
    level.total = getNextLevel();
    currentLevel++;
  }
  
  pop();

  for (var i = 0; i < UIElements.length; i++) {
    UIElements[i].draw();
    UIElements[i].update();
  }
  
  var curGridIndex = getCellIndex(mouseX, mouseY);
  if (currentSelected === "conveyor") {
    if (curGridIndex) {
      let currCell = grid[curGridIndex[0]][curGridIndex[1]];
      if (!currCell.extractor && !["sphere", "center"].includes(currCell.type)) {
        if (currCell.type && !currCell.preview) {
          currCell.previousType = currCell.type;
          currCell.previousCanDelete = currCell.canDelete
          currCell.previousDir = currCell.dir
        }
        currCell.type = "conveyor";
        currCell.preview = true;
        currCell.dir = currRot; // Set the direction for the preview cell
        if (isClicking) {
          currCell.type = "conveyor";
          currCell.preview = false;
        }
      }
    }
  }
  
  if (currentSelected === "extractor") {
    if (curGridIndex) {
      let currCell = grid[curGridIndex[0]][curGridIndex[1]];
      if (currCell.type && !currCell.preview) {
        currCell.previousType = currCell.type;
      }
      if (currCell.extractor && !currCell.preview) {
        currCell.previousExtractor = currCell.extractor;
        currCell.previousDir = currCell.dir
      }
      if (currCell.type !== "center") {
        currCell.extractor = true;
        currCell.preview = true;
      }
      currCell.dir = currRot; // Set the direction for the preview cell
      if (isClicking && ![null, "center"].includes(currCell.previousType)) {
        currCell.preview = false;
        currCell.extractor = true;
      }
    }
  }
  
  if (curGridIndex) {
    let currCell = grid[curGridIndex[0]][curGridIndex[1]];
    if (isRightClicking) {
      if (!currCell.preview) {
        if (currCell.canDelete) {
          currCell.type = null;
        }
        if (currCell.extractor) {
          currCell.extractor = false;
        }
      } else {
        if (currCell.previousCanDelete) {
          currCell.previousType = null;
        }
        if (currCell.previousExtractor) {
          currCell.previousExtractor = false;
        }
      }
    }
  }
  
  if (objects.length > 0) {
    for (var i = objects.length-1; i >= 0; i--) {
      objects[i].draw()
      if (frameCount % 15 === 0) {
        objects[i].move()
      }
    }
  }
}

function mouseDragged() {
  if (mouseButton === CENTER) {
    offsetX += mouseX - pmouseX;
    offsetY += mouseY - pmouseY;
  }
}

function mousePressed() {
  if (mouseOverUI()) {
    if (mouseButton === RIGHT) {
    isRightClickingUI = true
  } else if (mouseButton === LEFT) {
    isClickingUI = true;
  }
  }
  
  if (mouseButton === RIGHT) {
    isRightClicking = true
  } else if (mouseButton === LEFT) {
    isClicking = true;
  }
}

function mouseReleased() {
  isClicking = false;
  isRightClicking = false;
  isClickingUI = false;
  isRightClickingUI = false;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    currRot = "up"
  } else if (keyCode === DOWN_ARROW) {
    currRot = "down"
  } else if (keyCode === LEFT_ARROW) {
    currRot = "left"
  } else if (keyCode === RIGHT_ARROW) {
    currRot = "right"
  }
}
