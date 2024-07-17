
function UIElement(x, y, w, h, type, bgImage, txt) {
  this.pos = createVector(x, y);
  this.startPos = this.pos.copy()
  this.size = createVector(w, h);
  this.startSize = this.size.copy();
  this.bgImage = bgImage;
  this.type = type;
  this.hovered = false;
  this.clicked = false;
  this.rightClicked = false;
  this.string = txt;

  this.draw = function () {
    this.hovered = this.isHovered()
    this.clicked = isClickingUI && this.hovered
    this.rightClicked = isRightClickingUI && this.hovered
    
    if (this.hovered) {
      this.pos.x = lerp(this.pos.x, this.startPos.x-5, 0.1)
      this.pos.y = lerp(this.pos.y, this.startPos.y-5, 0.1)
      this.size.x = lerp(this.size.x, this.startSize.x+10, 0.1)
      this.size.y = lerp(this.size.y, this.startSize.y+10, 0.1)
    } else {
      this.pos.x = lerp(this.pos.x, this.startPos.x+5, 0.1)
      this.pos.y = lerp(this.pos.y, this.startPos.y+5, 0.1)
      this.size.x = lerp(this.size.x, this.startSize.x-10, 0.1)
      this.size.y = lerp(this.size.y, this.startSize.y-10, 0.1)
    }
    
    if (this.clicked || this.rightClicked) {
      this.pos.x = lerp(this.pos.x, this.startPos.x-7, 0.1)
      this.pos.y = lerp(this.pos.y, this.startPos.y-7, 0.1)
      this.size.x = lerp(this.size.x, this.startSize.x+12, 0.1)
      this.size.y = lerp(this.size.y, this.startSize.y+12, 0.1)
    } else {
      this.pos.x = lerp(this.pos.x, this.startPos.x+7, 0.1)
      this.pos.y = lerp(this.pos.y, this.startPos.y+7, 0.1)
      this.size.x = lerp(this.size.x, this.startSize.x-12, 0.1)
      this.size.y = lerp(this.size.y, this.startSize.y-12, 0.1)
    }
    
    image(this.bgImage, this.pos.x, this.pos.y, this.size.x, this.size.y);
    
    let textX = this.pos.x + this.size.x/2
    let textY = this.pos.y + this.size.y + 5;
    
    textAlign(CENTER, TOP)
    textSize(14)
    fill(0)
    text(this.string, textX, textY)
  };
  
  this.update = function() {
    if (this.clicked) {
      currentSelected = this.type
    }
    
    if (this.rightClicked) {
      currentSelected = null
    }
  }

  this.isHovered = function () {
    return mouseX >= this.pos.x && mouseX <= this.pos.x + this.size.x &&
           mouseY >= this.pos.y && mouseY <= this.pos.y + this.size.y;
  };
}
