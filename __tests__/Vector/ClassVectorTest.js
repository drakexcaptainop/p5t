const { Vector } = require('../../vector.js')

describe('Vector class static/instance methods', () => {
  describe('arrayAdd', () => {
    test('Prueba 1: entrada [] y escalar 1 => []', () => {
      expect(Vector.arrayAdd([], 1)).toEqual([])
    })

    test('Prueba 2: entrada [1,2] y t=[1,2] => [2,4]', () => {
      expect(Vector.arrayAdd([1,2], [1,2])).toEqual([2,4])
    })

    test('Prueba 3: entrada [1,2] y t=1 => [2,3]', () => {
      expect(Vector.arrayAdd([1,2], 1)).toEqual([2,3])
    })
  })

  describe('arrayDot', () => {
    test('Prueba 1: [1,1] . [2,2] = 4', () => {
      expect(Vector.arrayDot([1,1], [2,2])).toBe(4)
    })

    test('Prueba 2: [] . [] = 0', () => {
      expect(Vector.arrayDot([], [])).toBe(0)
    })
  })

  describe('arrayMult', () => {
    test('Prueba 1: [] * 1 => []', () => {
      expect(Vector.arrayMult([], 1)).toEqual([])
    })

    test('Prueba 2: [1,2] * 2 => [2,4]', () => {
      expect(Vector.arrayMult([1,2], 2)).toEqual([2,4])
    })
  })

  describe('arraySub', () => {
    test('Prueba 1: [] - 1 => []', () => {
      expect(Vector.arraySub([], 1)).toEqual([])
    })

    test('Prueba 2: [1,2] - [1,2] => [0,0]', () => {
      expect(Vector.arraySub([1,2], [1,2])).toEqual([0,0])
    })

    test('Prueba 3: [1,2] - 1 => [0,1]', () => {
      expect(Vector.arraySub([1,2], 1)).toEqual([0,1])
    })
  })

  describe('asArray', () => {
    test('Prueba 1: Vector(1,2,3).asArray() => [1,2,3]', () => {
      const v = new Vector(1,2,3)
      expect(v.asArray()).toEqual([1,2,3])
    })
  })

  describe('dot (instance)', () => {
    test('Prueba 1: this=Vector(1,1), u=null => 2', () => {
      const v = new Vector(1,1,0)
      expect(v.dot(null)).toBe(2)
    })

    test('Prueba 2: this=Vector(1,1), u=Vector(1,2) => 3', () => {
      const v = new Vector(1,1,0)
      const u = new Vector(1,2,0)
      expect(v.dot(u)).toBe(3)
    })
  })
})