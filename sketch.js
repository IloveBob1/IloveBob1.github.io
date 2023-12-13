class LSystem {
  constructor(axiom, rules, angle, len) {
    this.axiom = axiom;
    this.sentence = axiom;
    this.rules = rules;
    this.angle = angle;
    this.len = len;
  }

  generate() {
    this.len *= 0.5;
    let nextSentence = "";
    for (let i = 0; i < this.sentence.length; i++) {
      let current = this.sentence.charAt(i);
      let found = false;
      for (let j = 0; j < this.rules.length; j++) {
        if (current == this.rules[j].a) {
          found = true;
          nextSentence += this.rules[j].b;
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    this.sentence = nextSentence;
    createP(this.sentence);
    this.turtle();
  }

  turtle() {
    background(51);
    resetMatrix();
    translate(width / 2, height);
    stroke(255);
    for (let i = 0; i < this.sentence.length; i++) {
      let current = this.sentence.charAt(i);

      if (current == "F") {
        line(0, 0, 0, -this.len);
        translate(0, -this.len);
      } else if (current == "+") {
        rotate(this.angle);
      } else if (current == "-") {
        rotate(-this.angle);
      } else if (current == "[") {
        push();
      } else if (current == "]") {
        pop();
      }
    }
  }
}

let lSystem;

function setup() {
  createCanvas(400, 400);
  let axiom = "F";
  let rules = [
    {
      a: "F",
      b: "FF+[+F-F-F]-[-F+F+F]",
    },
  ];
  let angle = radians(25);
  let len = 100;

  lSystem = new LSystem(axiom, rules, angle, len);

  background(51);
  createP(axiom);
  lSystem.turtle();

  let button = createButton("generate");
  button.mousePressed(generate);
}

function generate() {
  lSystem.generate();
}
