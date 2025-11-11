
const {HMM} = require('../../sampler')

describe("HMM.normalizeEmissionMatrix", () => {
  test("Emision esta vacia", () => {
    let q = new HMM( [], [[]] )
    q.setStates()
    q.setObservables()
    expect(q.normalizeEmmisionMatrix().EMM).toEqual(
      [[]]
    );
  });

 test("Emision tiene elementos", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[2, 2], [2, 2]] )
    q.setStates()
    q.setObservables()
    expect(q.normalizeEmmisionMatrix().EMM).toEqual(
      [[.5, .5], [.5, .5]]
    );
  });

});

describe("HMM.normalizeTransiotionMatrix", () => {
  test("Emision esta vacia", () => {
    let q = new HMM( [], [[]] )
    q.setStates()
    expect(q.normalizeEmmisionMatrix().TRS).toEqual(
      []
    );
  });

 test("Emision tiene elementos", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[2, 2], [2, 2]] )
    q.setStates()
    q.setObservables()
    expect(q.normalizeTransitionMatrix().TRS).toEqual(
      [[.5, .5], [.5, .5]]
    );
  });

});


describe("HMM.setStates", () => {
  test("Se coloca en base a la matriz de transicion", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[]] )
    q.setStates()
    expect(q.states).toEqual(
      [0, 1]
    );
  });

 test("Se coloca estados manualmente", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[2, 2], [2, 2]] )
    q.setStates([4, 5])
    expect(q.states).toEqual(
      [4, 5]
    );
  });

});

describe("HMM.setObservables", () => {
  test("Se coloca en base a la matriz de transicion", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[1, 1], [1, 1]] )
    q.setObservables()
    expect(q.observables).toEqual(
      [0, 1]
    );
  });

 test("Se coloca estados manualmente", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[2, 2], [2, 2]] )
    q.setObservables([4, 5])
    expect(q.observables).toEqual(
      [4, 5]
    );
  });

});



describe("HMM.samplePath", () => {
  test("El tamañ0 de muestra es 0", () => {
    let q = new HMM( [[1, 1], [1, 1]], [[1, 1], [1, 1]] )
    q.setObservables().setStates().normalizeEmmisionMatrix().normalizeTransitionMatrix()
    expect(q.samplePath(0, 0)).toEqual(
      [[], [0]]
    );
  });

 test("Se coloca estados manualmente", () => {
    let q = new HMM( [[1, 0], [1, 0]], [[1, 0], [1, 0]] )
    q.setObservables().setStates().normalizeEmmisionMatrix().normalizeTransitionMatrix()
    expect(q.samplePath(1, 0)).toEqual(
      [[0], [0,0]]
    );
  });

});