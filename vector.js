class Transformation{
    static linearCombination(B, u){
        let z = new Vector( 0, 0, 0 )
        for(let i=0; i<vecs.length; i++){
            z.add( p5.Vector.mult( B[i], u[i] ) )
        }
        return z
    }
    static customVectorBaseToStandardBase( B, u ){
        if( u instanceof Vector ) u = u.asArray(  )
        return Transformation.linearCombination( B, u )
    }

    static standardVectorBaseToOrthogonalBase( B, u ){
        if( u instanceof Array ) u = u.asArray( )
        let Bt = Transformation.baseTranspose( B )
        return this.linearCombination( Bt, u )        
    }
    static baseInverse(B){
        
    }
    static upperTriangularReduction(B){
        let rows = B.length
        let cols = B[0].length
        if(rows != cols) throw new Error( "Invalid" )
        let I = Transformation.eye( rows )
        
    }

    static copy(B){
        return  new Array( B.length ).fill(0).map( (_, i) => {
            return new Array( B[0].length ).map( (_, j) => {
                return B[i][j]
            } )
        } )
    }
    static lowerTriangularReduction(B){
        let rows = B.length
        let cols = B[0].length
        let Bc = Transformation.copy( B )
        if(rows != cols) throw new Error( "Invalid" )
        let I = Transformation.eye( rows )
        for( let j=0; j<cols;j++ ){
            for(let i=j; i<rows; i++){
                if(i == j){
                    I[i] = Vector.arrayDiv( I[i], I[i][i] )
                    Bc[i] = Vector.arrayDiv( Bc[i], Bc[i][i] )
                }else{
                    Bc[i] = Vector.arraySub( Bc[i], Vector.arrayMult( Bc[j], Bc[i][j] ) )
                    I[i] = Vector.arraySub( I[i], Vector.arrayMult( I[j], I[i][j] ) )
                }
            }
        }
    }
    static eye(N){
        let B = new Array( N ).fill( 0 ).map( (_, i) => {
            let bt = new Array( N ).fill( 0 )
            bt[i] = 1 
            return bt
        } )
        return B
    }

    static baseTranspose( B ){
        Bt = new Array(B[0].length).map( _ => new Array( B.length ).fill(0) )
        for(let j=0; j<B[0].length; j++){
            for(let i=0; i<B.length; i++){
                Bt[j][i] = B[i][j]
            }
        }
        return Bt
    }
}
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

    get orthogonal(){
        return new Vector( -this.y, this.x )
    }
    get normalized(){
        return this.copy().mult( this.magnitude )
    }
    static arrayMult(arr, t){
        return arr.map( v => v * t )
    }
    static arrayAdd(arr, t){
        let isScalar = t instanceof Number
        return arr.map( (v, i) => v + (isScalar ? t : t[i]) )
    }
    static arraySub(arr, t){
        let isScalar = t instanceof Number
        return arr.map( (v, i) => v - (isScalar ? t : t[i]) )
    }
    static arrayDiv(arr, t){
        return Vector.arrayMult( arr, 1/t )
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