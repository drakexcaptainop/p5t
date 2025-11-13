// Cleaned vector implementation: Vector, Matrix and MatrixDecomposition

class Vector{
    constructor(x, y, z){
        this.x = x || 0
        this.y = y || 0
        this.z = z || 0
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
        this.x -= u.x 
        this.y -= u.y 
        this.z -= u.z 
        return this
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
        let iscalar = typeof t == "number"
        let result = new Array( arr.length ).fill(0)
        for ( let i = 0; i < arr.length; i++ ){
            let addend = iscalar ? t : t[i]
            result[i] = arr[i] + addend
        }
        return result
    }
    static arraySub(arr, t){
        let isscalar = typeof t == "number"
        let result = new Array( arr.length ).fill(0)
        for ( let i = 0; i < arr.length; i++ ){
            let subt = isscalar ? t : t[i]
            result[i] = arr[i] - subt
        }
        return result
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
    static arrayNorm(arr1){
        return Math.sqrt( Vector.arrayDot( arr1, arr1 ) )
    }
}

class Matrix{
    static linearCombination(B, u){
        let z = new Array(u.length).fill(0)
        let Bt = Matrix.baseTranspose( B )
        for(let i=0; i<B[0].length; i++){
            z = Vector.arrayAdd( z, Vector.arrayMult( Bt[i], u[i] ) )
        }
        return z
    }
    static customVectorBaseToStandardBase( B, u ){
        if( u instanceof Vector ) u = u.asArray(  )
        return Matrix.linearCombination( B, u )
    }

    static standardVectorBaseToOrthogonalBase( B, u ){
        if( u instanceof Vector ) u = u.asArray( )
        let Bt = Matrix.baseTranspose( B )
        return Matrix.linearCombination( Bt, u )        
    }
    static baseInverse(B){
        let [L, I] = Matrix.lowerTriangularReduction( B, Matrix.eye( B.length ) )
        let [_, Bi] = Matrix.upperTriangularReduction( L, I )
        return Bi
    }
    static upperTriangularReduction(B, I){
        let [rows, cols] = Matrix.shape( B )
        let Bc = Matrix.copy( B )
        if(rows != cols) throw new Error( "Invalid" )
        for( let j=0; j<cols;j++ ){
            for(let i=0; i<j; i++){
                if(i == j){
                    let cst = Bc[i][i]
                    I[i] = Vector.arrayDiv( I[i], cst )
                    Bc[i] = Vector.arrayDiv( Bc[i], cst )
                }else{
                    I[i] = Vector.arraySub( I[i], Vector.arrayMult( I[j], Bc[i][j] ) )
                    Bc[i] = Vector.arraySub( Bc[i], Vector.arrayMult( Bc[j], Bc[i][j] ) )
                }
            }
        }
        return [Bc, I]
    }
    static lowerTriangularReduction(B, I){
        let [rows, cols] = Matrix.shape( B )
        let Bc = Matrix.copy( B )
        if(rows != cols) throw new Error( "Invalid" )
        for( let j=0; j<cols;j++ ){
            for(let i=j; i<rows; i++){
                if(i == j){
                    let cst = Bc[i][i]
                    I[i] = Vector.arrayDiv( I[i], cst )
                    Bc[i] = Vector.arrayDiv( Bc[i], cst )
                 }else{
                    I[i] = Vector.arraySub( I[i], Vector.arrayMult( I[j], Bc[i][j] ) )
                    Bc[i] = Vector.arraySub( Bc[i], Vector.arrayMult( Bc[j], Bc[i][j] ) )
                }
            }
        }
        return [Bc, I]
    }
    

    static shape( B ){
        return [B.length, B[0].length]
    }
    static zerosMatrix(N, M){
        return new Array(N).fill(0).map(_ => new Array(M).fill(0))
    }
    static copy(B){
        let [rows, cols] = Matrix.shape( B )
        let Bc = Matrix.zerosMatrix(rows, cols)
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                Bc[i][j] = B[i][j]
            }
        }
        return Bc
    }

    static eye(N){
        let B = Matrix.zerosMatrix( N, N )
        for(let i=0; i<N; i++){
            B[i][i] = 1
        }
        return B
    }

    static baseTranspose( B ){
        let Bt = Matrix.zerosMatrix( ...Matrix.shape( B ).reverse() )
        for(let j=0; j<B[0].length; j++){
            for(let i=0; i<B.length; i++){
                Bt[j][i] = B[i][j]
            }
        }
        return Bt
    }
    static column(B, j){
        return B.map(row => row[j])
    }

    static hstack(A, b){
        let At = Matrix.baseTranspose( A )
        At.push( b )
        return Matrix.baseTranspose( At )
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


`

const VUtils = {
    ortho2: function ( u ) {
        return createVector( -u.y, u.x )
    },
    linear: function (vecs, alphas){
        let z = createVector()
        for(let i=0; i<vecs.length; i++){
            z.add( p5.Vector.mult( vecs[i], alphas[i] ) )
        }
        return z
    },
    base2std: function (b1, b2, alpha){
        return VUtils.linear( [b1, b2], [alpha.x, alpha.y] )
    },
    std2orthobase: function(b1, b2, alpha){
        return createVector( b1.dot(alpha), b2.dot(alpha) )
    },
    rotate: function(u, beta) {
        return VUtils.linear( [ createVector(cos(beta), sin(beta)), createVector(-sin(beta), cos(beta)) ],
    [u.x, u.y] )
    },
    clamp( v, u, l ) {
        return createVector( constrain( v.x, u, l ), constrain( v.y, u, l ) )
    }
}
`

if (typeof module !== "undefined") {
    module.exports = {
        Matrix,
        Vector,
        MatrixDecomposition
    }
}
