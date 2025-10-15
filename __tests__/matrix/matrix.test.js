const { Matrix } = require("../../vector");


describe("Matrix.add", () => {
  test("suma matrices del mismo tamaño", () => {
    const A = [
      [1, 1],
      [2, 2],
    ];
    const B = [
      [0, 0],
      [1, 1],
    ];
    expect(Matrix.add(A, B)).toEqual([
      [1, 1],
      [3, 3],
    ]);
  });

  test("lanza un error cuando las filas difieren", () => {
    const A = [[1], [0]];
    const B = [[1, 2]];
    expect(() => Matrix.add(A, B)).toThrow("Incompatible shapes for addition");
  });

  test("lanza un error cuando las columnas difieren", () => {
    const A = [[1, 1]];
    const B = [[1]];
    expect(() => Matrix.add(A, B)).toThrow("Incompatible shapes for addition");
  });
});

describe("Matrix.sub", () => {
  test("resta matrices del mismo tamaño", () => {
    const A = [
      [1, 1],
      [2, 2],
    ];
    const B = [
      [0, 0],
      [1, 1],
    ];
    expect(Matrix.sub(A, B)).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  test("lanza un error cuando las filas difieren", () => {
    const A = [[1], [0]];
    const B = [[1, 2]];
    expect(() => Matrix.sub(A, B)).toThrow("Incompatible shapes for subtraction");
  });

  test("lanza un error cuando las columnas difieren", () => {
    const A = [[1, 1]];
    const B = [[1]];
    expect(() => Matrix.sub(A, B)).toThrow("Incompatible shapes for subtraction");
  });
});

describe("Matrix.baseTranspose", () => {

  test("retorna una matriz vacía cuando la entrada tiene filas vacías", () => {
    expect(Matrix.baseTranspose([[]])).toEqual([]);
  });

  test("retorna la transpuesta para matrices cuadradas", () => {
    const result = Matrix.baseTranspose([
      [1, 2],
      [3, 4],
    ]);
    expect(result).toEqual([
      [1, 3],
      [2, 4],
    ]);
  });
});

describe("Matrix.eye", () => {
  test("retorna una matriz vacía cuando el tamaño es 0", () => {
    expect(Matrix.eye(0)).toEqual([]);
  });

  test("retorna la identidad 1x1 cuando el tamaño es 1", () => {
    expect(Matrix.eye(1)).toEqual([[1]]);
  });

  test("retorna la identidad para matrices cuadradas mayores", () => {
    expect(Matrix.eye(2)).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});

describe("Matrix.column", () => {
  test("obtiene la columna solicitada", () => {
    const B = [[1, 2]];
    expect(Matrix.column(B, 0)).toEqual([1]);
  });

  test("obtiene otra columna cuando j es mayor a cero", () => {
    const B = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(Matrix.column(B, 1)).toEqual([2, 5]);
  });
});

describe("Matrix.copy", () => {
  test("copia matrices con contenido", () => {
    const B = [
      [1, 1],
      [2, 2],
    ];
    const copy = Matrix.copy(B);
    expect(copy).toEqual(B);
    expect(copy).not.toBe(B);
    copy[0][0] = 99;
    expect(B[0][0]).toBe(1);
  });

  test("lanza error con matrices vacías", () => {
    expect(() => Matrix.copy([])).toThrow();
  });

  test("copia matrices con filas vacías", () => {
    expect(Matrix.copy([[]])).toEqual([[]]);
  });
});

describe("Matrix.linearCombination", () => {
  test("regresa el vector nulo cuando los coeficientes son cero", () => {
    const B = [
      [1, 1],
      [1, 1],
    ];
    const result = Matrix.linearCombination(B, [0, 0]);
    expect(result).toEqual([0, 0]);
  });

  test("funciona con bases degeneradas", () => {
    const B = [[]];
    const result = Matrix.linearCombination(B, []);
    expect(result).toEqual([]);
  });
});

describe("Matrix.lowerTriangularReduction", () => {
  test("lanza error cuando la matriz no es cuadrada", () => {
    expect(() => Matrix.lowerTriangularReduction([[1, 1]], [[1, 1]])).toThrow(
      "Invalid",
    );
  });

  test("lanza error con matrices vacías", () => {
    expect(() => Matrix.lowerTriangularReduction([[]], [[]])).toThrow("Invalid");
  });

  test("mantiene matrices triangulares inferiores ya reducidas", () => {
    const B = [
      [1, 1],
      [0, 1],
    ];
    const I = [
      [1, 0],
      [0, 1],
    ];
    const [Lc, Ic] = Matrix.lowerTriangularReduction(
      Matrix.copy(B),
      Matrix.copy(I),
    );
    expect(Lc).toEqual([
      [1, 1],
      [0, 1],
    ]);
    expect(Ic).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});

describe("Matrix.upperTriangularReduction", () => {
  test("lanza error cuando la matriz no es cuadrada", () => {
    expect(() => Matrix.upperTriangularReduction([[1, 1]], [[1, 1]])).toThrow(
      "Invalid",
    );
  });

  test("lanza error con matrices vacías", () => {
    expect(() => Matrix.upperTriangularReduction([[]], [[]])).toThrow("Invalid");
  });

  test("mantiene matrices triangulares superiores ya reducidas", () => {
    const B = [
      [1, 0],
      [0, 1],
    ];
    const I = [
      [1, 0],
      [0, 1],
    ];
    const [Uc, Ic] = Matrix.upperTriangularReduction(
      Matrix.copy(B),
      Matrix.copy(I),
    );
    expect(Uc).toEqual([
      [1, 0],
      [0, 1],
    ]);
    expect(Ic).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});

describe("Matrix.customVectorBaseToStandardBase", () => {
  test("combina arreglos de base y coordenadas para obtener el vector estándar", () => {
    const B = [
      [1, 0],
      [0, 1],
    ];
    expect(Matrix.customVectorBaseToStandardBase(B, [2, 3])).toEqual([2, 3]);
  });
});

describe("Matrix.standardVectorBaseToOrthogonalBase", () => {
  test("realiza combinacion linear", () => {
    const B = [
      [1, 0],
      [0, 1],
    ];
    expect(Matrix.standardVectorBaseToOrthogonalBase(B, [1, 2])).toEqual(
      [1, 2]
    );
  });
});

describe("Matrix.baseInverse", () => {
  test("lanza error porque lowerTriangularReduction requiere una matriz identidad", () => {
    const B = [
      [1, 0],
      [0, 1],
    ];
    expect(Matrix.baseInverse(B)).toEqual(
      [
      [1, 0],
      [0, 1],
    ]
    );
  });
});

describe("Matrix.shape", () => {
  test("retorna la cantidad de filas y columnas", () => {
    const B = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    expect(Matrix.shape(B)).toEqual([2, 3]);
  });
});

describe("Matrix.zerosMatrix", () => {
  test("crea una matriz llena de ceros con las dimensiones solicitadas", () => {
    expect(Matrix.zerosMatrix(2, 2)).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });
});

describe("Matrix.baseInverse2d", () => {
  test("retorna una matriz de ceros para bases invertibles debido a la implementación actual", () => {
    const B = [
      [1, 0],
      [0, 1],
    ];
    expect(Matrix.baseInverse2d(B)).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});



describe("Matrix.matMult", () => {
  test("lanza error cuando num columnas de A es diferente numero filas de B", () => {
    expect(Matrix.matMult([[]], [[]])).toThrow(
      "Invalid",
    );
  });

  test("mutiplicacion con una matriz vacia pero dimensions correctas", () => {
    expect(Matrix.matMult([[1]], [[]])).toEqual([[]]);
  });

  test("multiplicacion standaard", () => {

    const R = Matrix.matMult(
      [[1]],
      [[2]],
    );
    expect(R).toEqual([
      [2]
    ]);

  });
});