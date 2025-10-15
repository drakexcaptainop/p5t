const { PROBABILITY_UTILS } = require('../../sampler');

describe("PROBABILITY_UTILS.discreteSample", () => {
  test("la distrubcion de entrada tiene elementeos", () => {
    let p = [.1, .5, .4]
    expect(PROBABILITY_UTILS.discreteSample(p)).toBe(
      2
    );
  });

  test("la distrubcion de entrada esta vacia", () => {
    let p = []
    expect(PROBABILITY_UTILS.discreteSample(p)).toBe(
      undefined
    );
  });
  
});




describe("PROBABILITY_UTILS.normalizePmf", () => {
  test("la distrubcion de entrada tiene elementeos", () => {
    let p = [2, 2]
    expect(PROBABILITY_UTILS.normalizePmf(p)).toEqual(
      [.5, .5]
    );
  });

  test("la distrubcion de entrada esta vacia", () => {
    let p = []
    expect(PROBABILITY_UTILS.normalizePmf(p)).toEqual(
      []
    );
  });
  
});

describe("PROBABILITY_UTILS.setKissState", () => {
  test("enviado de semilla", () => {
    expect( 
        PROBABILITY_UTILS.setKissSeed(0).kissState
     ).toEqual(
            {x: 123456789, y: 3735928559, z: 19088743, c: 11259375}
        )
  });
  
});

describe("PROBABILITY_UTILS.concentratedUniform", () => {
  test("pr se envia como indefinido para ser seteado por la funcion", () => {
    let p =PROBABILITY_UTILS.concentratedUniform(2, 1)
    expect(p[0]).toBeCloseTo(0.15)
    expect(p[1]).toBeCloseTo(0.85)
  });

  test("pr se envia como numero", () => {
    let p =PROBABILITY_UTILS.concentratedUniform(2, 1, .9)
    expect(p[0]).toBeCloseTo(0.1)
    expect(p[1]).toBeCloseTo(0.9)
  });
  
});