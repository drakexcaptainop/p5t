// Cleaned vector implementation: Vector, Matrix and MatrixDecomposition

class Vector{
    constructor(x = 0, y = 0, z = 0){
        this.x = x
        this.y = y
        this.z = z
    }
    asArray(){
        return [ this.x, this.y, this.z ]
    }
    add(u){
        this.x += u.x
        this.y += u.y
        this.z += u.z
        return this
    }
    mult(t){
        this.x *= t
        this.y *= t
        this.z *= t
        return this
    }
    sub(u){
        return new Vector(this.x - u.x, this.y - u.y, this.z - u.z)
    }
    div(t){
        return new Vector(this.x / t, this.y / t, this.z / t)
    }
    copy(){
        return new Vector( this.x, this.y, this.z )
    }
    dot(u){
        if (!u){
            u = this
        }
        return this.x * (u.x||0) + this.y * (u.y||0) + this.z * (u.z||0)
    }
    get magnitude(){
        return Math.sqrt( this.dot() )
    }
    get orthogonal2d(){
        return new Vector( -this.y, this.x, 0 )
    }
    get normalized(){
        const m = this.magnitude || 1
        return new Vector(this.x / m, this.y / m, this.z / m)
    }

    // static array utilities
    static arrayMult(arr, t){
        if (!Array.isArray(arr)) return []
        return arr.map(v => v * t)
    }
    static arrayAdd(arr, t){
        if (!Array.isArray(arr)) return []
        const iscalar = (typeof t === 'number') || (t instanceof Number)
        return arr.map((v, i) => v + (iscalar ? t : t[i]))
    }
    static arraySub(arr, t){
        if (!Array.isArray(arr)) return []
        const iscalar = (typeof t === 'number') || (t instanceof Number)
        return arr.map((v, i) => v - (iscalar ? t : t[i]))
    }
    static arrayDiv(arr, t){
        if (!Array.isArray(arr)) return []
        return arr.map(v => v / t)
    }
    static arrayDot(arr1, arr2){
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return 0
        let sum = 0
        for (let i = 0; i < arr1.length; i++){
            sum += (arr1[i] || 0) * (arr2[i] || 0)
        }
        return sum
    }
    static arrayNorm(arr){
        return Math.sqrt(Vector.arrayDot(arr, arr))
    }
}

class Matrix{
    static shape(B){
        return [B.length, B[0].length]
    }
    static zerosMatrix(N, M){
        return new Array(N).fill(0).map(_ => new Array(M).fill(0))
    }
    static copy(B){
        return B.map(row => row.slice())
    }
    static baseTranspose(B){
        const [rows, cols] = Matrix.shape(B)
        const Bt = Matrix.zerosMatrix(cols, rows)
        for (let i=0;i<rows;i++) for (let j=0;j<cols;j++) Bt[j][i] = B[i][j]
        return Bt
    }
    static column(B, j){
        return B.map(row => row[j])
    }
    static setColumn(B, j, column){
        for(let i = 0; i < B.length; i++) B[i][j] = column[i]
        return B
    }
    static matMult(A, B){
        const [aRows, aCols] = Matrix.shape(A)
        const [bRows, bCols] = Matrix.shape(B)
        if (aCols !== bRows) throw new Error('Incompatible shapes')
        const R = Matrix.zerosMatrix(aRows, bCols)
        for(let i=0;i<aRows;i++){
            for(let k=0;k<bCols;k++){
                R[i][k] = Vector.arrayDot(A[i], Matrix.column(B, k))
            }
        }
        return R
    }
    static mult(B, t){
        const [rows, cols] = Matrix.shape(B)
        return Matrix.copy(B).map(row => row.map(v => v * t))
    }
    static baseInverse2d(B){
        const det = B[0][0]*B[1][1] - B[0][1]*B[1][0]
        return Matrix.mult([[B[1][1], -B[0][1]], [-B[1][0], B[0][0]]], 1/det)
    }
}

class MatrixDecomposition{
    static gramSchmidt(A){
        const mat = Matrix.copy(A)
        const [rows, cols] = Matrix.shape(mat)
        const Q = Matrix.zerosMatrix(rows, cols)
        for(let j=0;j<cols;j++){
            let v = Matrix.column(mat, j)
            for(let i=0;i<j;i++){
                const q = Matrix.column(Q, i)
                const proj = Vector.arrayMult(q, Vector.arrayDot(q, v))
                v = Vector.arraySub(v, proj)
            }
            const rjj = Vector.arrayNorm(v)
            if(rjj > Number.EPSILON){
                const normalized = Vector.arrayMult(v, 1/rjj)
                Matrix.setColumn(Q, j, normalized)
            } else {
                Matrix.setColumn(Q, j, new Array(rows).fill(0))
            }
        }
        return Q
    }
    static upperTriangularFromQ(A, Q){
        const Qt = Matrix.baseTranspose(Q)
        return Matrix.matMult(Qt, A)
    }
    static QR(A){
        const Q = MatrixDecomposition.gramSchmidt(A)
        const R = MatrixDecomposition.upperTriangularFromQ(A, Q)
        return [Q, R]
    }
}

module.exports = { Vector, Matrix, MatrixDecomposition }
