const { MatrixDecomposition } = require('../../vector');

describe("MatrixDecomposition.gramSchmidt", () => {
  test("realiza decomposicion ortogonal", () => {
    expect(MatrixDecomposition.gramSchmidt([[1, 0], [0, 1]])).toEqual(
    [[1, 0], [0, 1]]
    );
  });

  test("matriz no invertible", () => {
    expect(MatrixDecomposition.gramSchmidt([[0, 0], [0, 0]])).toEqual(
    [[0, 0], [0, 0]]
    );
  });

  test("matriz vacia", () => {

    expect(MatrixDecomposition.gramSchmidt([[]])).toEqual(
    [[]]
    );

  });
});