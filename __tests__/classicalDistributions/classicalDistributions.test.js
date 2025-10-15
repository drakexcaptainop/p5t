const { PROBABILITY_UTILS, ClassicalDistributions } = require('../../sampler');

describe("ClassicalDistributions.sampleNormal", () => {
  test("usa mock en probability utils para generar valores", () => {
    const mockRandom = jest.spyOn(PROBABILITY_UTILS, "kissUniform")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.25);

    const result = ClassicalDistributions.sampleNormal(0, 1);

    const u1 = 0.5, u2 = 0.25;
    const expected = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    expect(result).toBeCloseTo(expected);

    mockRandom.mockRestore();
  });
});