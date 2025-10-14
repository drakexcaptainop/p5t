class Vector{
    constructor(x, y, z){
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
        return this.mult(-1).add( u ).mult(-1)
    }
    div(t){
        return this.mult( 1/t )
    }

    copy(){
        return new Vector( this.x, this.y, this.z )
    }

    dot(u){
        if (!u){
            u = this
        }
        return this.x * u.x + this.y * u.y + this.z * u.z
    }
    mag(){
        return this.magnitude
    }
    get magnitude(){
        return Math.sqrt( this.dot(  ) )
    }

    get orthogonal2d(){
        return new Vector( -this.y, this.x )
    }
    get normalized(){
        return this.copy().div( this.magnitude )
    }
    static arrayMult(arr, t){
        let result = new Array( arr.length ).fill(0)
        for ( let i = 0; i < arr.length; i++ ){
            result[i] = arr[i] * t
        }
        return result
    }
    static arrayAdd(arr, t){
        let iscalar = t instanceof Number
        let result = new Array( arr.length ).fill(0)
        for ( let i = 0; i < arr.length; i++ ){
            let addend = iscalar ? t : t[i]
            result[i] = arr[i] + addend
        }
        return result
    }
    static arraySub(arr, t){
        let isscalar = t instanceof Number
        let result = new Array( arr.length ).fill(0)
        for ( let i = 0; i < arr.length; i++ ){
            let subt = isscalar ? t : t[i]
            result[i] = arr[i] - subt
        }
        return result
    }
    static arrayDiv(arr, t){
        return Vector.arrayMult( arr, 1/t )
    }

    static arrayDot(arr1, arr2){
        let sum = 0
        for ( let i = 0; i < arr1.length; i++ ){
            sum += arr1[i] * arr2[i]
        }
        return sum
    }
    static arrayNorm(arr1, arr2){
        return Math.sqrt( Vector.arrayDot( arr1, arr2 ) )
    }
}
class Matrix{
    static linearCombination(B, u){
        let z = new Vector( 0, 0, 0 )
        let Bt = Matrix.baseTranspose( B )
        for(let i=0; i<B[0].length; i++){
            z.add( p5.Vector.mult( Bt[i], u[i] ) )
        }
        return z
    }
    static customVectorBaseToStandardBase( B, u ){
        if( u instanceof Vector ) u = u.asArray(  )
        return Matrix.linearCombination( B, u )
    }

    static standardVectorBaseToOrthogonalBase( B, u ){
        if( u instanceof Array ) u = u.asArray( )
        let Bt = Matrix.baseTranspose( B )
        return Matrix.linearCombination( Bt, u )        
    }
    static baseInverse(B){
        let [L, I] = Matrix.lowerTriangularReduction( B )
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

    static zerosMatrix( N, M ){
        return new Array( N ).fill(0).map( _ => new Array( M ).fill(0) )
    }
    static baseInverse2d(B){
        let det = B[0][0] * B[1][1] - B[0][1] * B[1][0]
        return Matrix.mult( [
            [B[1][1], -B[0][1]],
            [-B[1][0], B[0][0]]
        ], 1/det )
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
        let Bt = Matrix.zerosMatrix( ...Matrix.shape( B ) )
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
    static setColumn(B, j, column){
        for(let i = 0; i < B.length; i++){
            B[i][j] = column[i]
        }
        return B
    }
    static  matMult(A, B){
        const [aRows, aCols] = Matrix.shape(A)
        const [bRows, bCols] = Matrix.shape(B)
        if (aCols !== bRows) {
            throw new Error("Incompatible shapes for multiplication")
        }
        const result = Matrix.zerosMatrix(aRows, bCols)
        for (let i = 0; i < aRows; i++) {
            for (let k = 0; k < bCols; k++) {
                result[i][k] = Vector.arrayDot(
                    A[i], Matrix.column( B, k )
                )
            }
        }
        return result
    }
    static mult(B, t){
        let [rows, cols] = Matrix.shape( B )
        let H = Matrix.zerosMatrix(  rows, cols )
        return H.map( row => row.map( Bij => Bij * t ) )
    }
    static add(A, B){
        const [aRows, aCols] = Matrix.shape(A)
        const [bRows, bCols] = Matrix.shape(B)
        if (aRows !== bRows || aCols !== bCols) {
            throw new Error("Incompatible shapes for addition")
        }
        return A.map((row, i) => row.map((value, j) => value + B[i][j]))
    }
    static sub(A, B){
        const [aRows, aCols] = Matrix.shape(A)
        const [bRows, bCols] = Matrix.shape(B)
        if (aRows !== bRows || aCols !== bCols) {
            throw new Error("Incompatible shapes for subtraction")
        }
        return A.map((row, i) => row.map((value, j) => value - B[i][j]))
    }
}

class MatrixDecomposition{

    static gramSchmidt(A){
        let mat = Matrix.copy(A)
        let [rows, cols] = Matrix.shape(mat)
        let Q = Matrix.zerosMatrix(rows, cols)
        for(let j = 0; j < cols; j++){
            let v = Matrix.column(mat, j)
            for(let i = 0; i < j; i++){
                let q = Matrix.column(Q, i)
                let projection = Vector.arrayMult(q, Vector.arrayDot(q, v))
                v = Vector.arraySub(v, projection)
            }
            let rjj = Vector.arrayNorm(v)
            if(rjj > Number.EPSILON){
                let normalized = Vector.arrayMult(v, 1 / rjj)
                Matrix.setColumn(Q, j, normalized)
            }else{
                Matrix.setColumn(Q, j, new Array(rows).fill(0))
            }
        }
        return Q
    }
    static upperTriangularFromQ(A, Q){
        let Qt = Matrix.baseTranspose( Q )
        return Matrix.matMult( Qt, A )
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
