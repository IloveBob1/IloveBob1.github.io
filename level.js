function Level(x, y, total, type, typeImage, imageWidth, imageHeight) {
  this.pos = createVector(x, y)
  this.imageSize = createVector(imageWidth, imageHeight)
  this.total = total;
  this.type = type;
  this.count = 0;
  this.typeImage = typeImage
  this.completed = false;
  
  this.draw = function() {
    fill(255)
    image(this.typeImage, this.pos.x-20, this.pos.y-40, this.imageSize.x, this.imageSize.y)
    textSize(20)
    text(`${this.count}/${this.total}`, this.pos.x+19, this.pos.y+40)
  }
}
