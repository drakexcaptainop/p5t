
const {Vector} = require('../../vector');

describe("Vector.arrayAdd", () => {
  test("retorna un arreglo vacío cuando ambos operandos están vacíos", () => {
    expect(Vector.arrayAdd([], 1)).toEqual([]);
  });

  test("suma elemento a elemento dos arreglos", () => {
    expect(Vector.arrayAdd([1, 2], [1, 2])).toEqual([2, 4]);
  });

  test("suma un escalar a cada elemento del arreglo", () => {
    expect(Vector.arrayAdd([1, 2], 1)).toEqual([2, 3]);
  });
});

describe("Vector.arrayDot", () => {
  test("calcula el producto punto correcto entre dos vectores", () => {
    expect(Vector.arrayDot([1, 1], [2, 2])).toBe(4);
  });

  test("producto punto de dos arreglos vacíos es 0", () => {
    expect(Vector.arrayDot([], [])).toBe(0);
  });
});

describe("Vector.arrayMult", () => {
  test("retorna un arreglo vacío cuando el arreglo fuente está vacío", () => {
    expect(Vector.arrayMult([], 1)).toEqual([]);
  });

  test("multiplica cada entrada del arreglo por el escalar dado", () => {
    expect(Vector.arrayMult([1, 2], 2)).toEqual([2, 4]);
  });
});

describe("Vector.arraySub", () => {
  test("retorna un arreglo vacío cuando ambos operandos están vacíos", () => {
    expect(Vector.arraySub([], 1)).toEqual([]);
  });

  test("resta elemento a elemento dos arreglos", () => {
    expect(Vector.arraySub([1, 2], [1, 2])).toEqual([0, 0]);
  });

  test("resta un escalar de cada elemento del arreglo", () => {
    expect(Vector.arraySub([1, 2], 1)).toEqual([0, 1]);
  });
});

describe("Vector.prototype.asArray", () => {
  test("convierte el vector a un arreglo [x, y, z]", () => {
    const vector = new Vector(1, 2, 3);
    expect(vector.asArray()).toEqual([1, 2, 3]);
  });
});

describe("Vector.prototype.dot", () => {
  test("retorna el producto punto consigo mismo si el argumento es nulo", () => {
    const vector = new Vector(1, 1);
    expect(vector.dot()).toBe(2);
  });

  test("retorna el producto punto con otro vector cuando se proporciona", () => {
    const vector = new Vector(1, 1);
    const other = new Vector(1, 2);
    expect(vector.dot(other)).toBe(3);
  });
});

describe("Vector.prototype.add", () => {
  test("suma otro vector componente a componente y retorna la misma instancia", () => {
    const vector = new Vector(1, 2, 3);
    const result = vector.add(new Vector(4, 5, 6));
    expect(result).toBe(vector);
    expect(vector.x).toBe(5);
    expect(vector.y).toBe(7);
    expect(vector.z).toBe(9);
  });
});

describe("Vector.prototype.mult", () => {
  test("multiplica cada componente por el escalar recibido", () => {
    const vector = new Vector(1, -2, 3);
    vector.mult(2);
    expect(vector.x).toBe(2);
    expect(vector.y).toBe(-4);
    expect(vector.z).toBe(6);
  });
});

describe("Vector.prototype.sub", () => {
  test("resta cada componente con el vector dado", () => {
    const vector = new Vector(5, 6, 7);
    vector.sub(new Vector(1, 2, 3));
    expect(vector.x).toBe(4);
    expect(vector.y).toBe(4);
    expect(vector.z).toBe(4);
  });
});

describe("Vector.prototype.div", () => {
  test("divide cada componente escalarmente", () => {
    const vector = new Vector(6, 9, 12);
    const result = vector.div(3);
    expect(result).toBe(vector);
    expect(vector.x).toBe(2);
    expect(vector.y).toBe(3);
    expect(vector.z).toBe(4);
  });
});

describe("Vector.prototype.copy", () => {
  test("crea un nuevo vector con los mismos valores", () => {
    const original = new Vector(3, 4, 5);
    const clone = original.copy();
    expect(clone.x).toBe(3);
    expect(clone.y).toBe(4);
    expect(clone.z).toBe(5);
  });
});

describe("Vector.prototype.mag", () => {
  test("mag retorna la magnitud del vector", () => {
    const vector = new Vector(1, 5, 0);
    expect(vector.mag()).toBeCloseTo(5.0990, 4); //.mag() ~ 5.0990
  });
});

describe("Vector.prototype.orthogonal2d", () => {
  test("retorna un vector orthogonal en 2D", () => {
    const vector = new Vector(3, 4);
    const orthogonal = vector.orthogonal2d;
    expect(orthogonal.x).toBe(-4);
    expect(orthogonal.y).toBe(3);
    expect(orthogonal.z).toBe(0);
  });
});

describe("Vector.prototype.normalized", () => {
  test("retorna un vector con magnitud 1 sin mutar el original", () => {
    const vector = new Vector(3, 4, 0);
    const normalized = vector.normalized;
    expect(normalized.mag()).toBeCloseTo(1);
  });
});

describe("Vector.prototype.dot", () => {
  test("retorna el producto punto consigo mismo si el argumento es nulo", () => {
    const vector = new Vector(1, 1);
    expect(vector.dot()).toBe(2);
  });

  test("retorna el producto punto con otro vector cuando se proporciona", () => {
    const vector = new Vector(1, 1);
    const other = new Vector(1, 2);
    expect(vector.dot(other)).toBe(3);
  });
});


describe("Vector.constructor", () => {
  test("asigna correctamente los tres valores cuando todos están definidos", () => {
    const p = new Vector(1, 1, 1);
    expect(p.x).toBe(1);
    expect(p.y).toBe(1);
    expect(p.z).toBe(1);
  });

  test("asigna 0 a todos no se envia nada", () => {
    const p = new Vector();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
    expect(p.z).toBe(0);
  });

  test("asigna 0 a x y z cuando son indefinido", () => {
    const p = new Vector(undefined, undefined, 1);
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
    expect(p.z).toBe(1);
  });

  test("asigna 0 a x  cuando es indefinido", () => {
    const p = new Vector(undefined, 1, 1);
    expect(p.x).toBe(0);
    expect(p.y).toBe(1);
    expect(p.z).toBe(1);
  });
});
