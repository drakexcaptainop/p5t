
const { MatrixDecomposition, Matrix } = require('../../vector.js');

describe('MatrixDecomposition (Complejidad 1)', () => {

  describe('upperTriangularFromQ', () => {
    test('debe calcular R = Q^T * A', () => {
      const Q = [[0.6, -0.8], [0.8, 0.6]];
      const A = [[1, 2], [3, 4]];

     
      const R = MatrixDecomposition.upperTriangularFromQ(A, Q);
      
      expect(R[0][0]).toBeCloseTo(3);
    });
  });
});