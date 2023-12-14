var slider;
function setup() {
  createCanvas(400, 400);
  slider = createSlider(0, 10, 2, 0.1);
  colorMode(HSB);
}

function draw() {
  background(0, 0, 20);
  translate(width / 2, height / 2);

  var a = 100;
  var b = 100;
  var n = slider.value();

  beginShape();
  for (var angle = 0; angle < TWO_PI; angle += 0.1) {
    const na = 2 / n;
    const cosAngle = cos(angle);
    const sinAngle = sin(angle);

    var x = pow(abs(cosAngle), na) * a * Math.sign(cosAngle);
    var y = pow(abs(sinAngle), na) * b * Math.sign(sinAngle);

    const hue = map(n, 0, 10, 0, 360);
    noStroke();
    fill(color(hue, 100, 100));

    vertex(x, y);
  }
  endShape(CLOSE);
}
