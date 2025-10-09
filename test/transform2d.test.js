import { Transform2d } from "../t.js";
import { expect } from "chai";

function createVector(x = 0, y = 0) {
  return {
    x,
    y,
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    sub(v) {
      return createVector(this.x - v.x, this.y - v.y);
    },
    dot(v) {
      return this.x * v.x + this.y * v.y;
    },
    heading() {
      return Math.atan2(this.y, this.x);
    },
  };
}

global.createVector = createVector;

describe("Transform2d", () => {
  it("se inicializa con posición correcta (pos)", () => {
    const pos = createVector(5, 10);
    const t = new Transform2d(pos);
    expect(t.pos.x).to.equal(5);
    expect(t.pos.y).to.equal(10);
  });

   it("fwd se asigna correctamente por defecto (0, -1)", () => {
    const t = new Transform2d(createVector(0, 0));
    expect(t.fwd.x).to.equal(0);
    expect(t.fwd.y).to.equal(-1);
  });


});