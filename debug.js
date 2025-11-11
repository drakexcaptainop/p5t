const DEBUG = {
    Debug: true,
    EllipseSize: 10,
    beginDebug(){
        if(this.Debug) push()
    },
    endDebug(){
        if(this.Debug) pop()
    },
    debug(f, ctx){
        if(!this.Debug) return
        this.beginDebug()
        if(ctx){ f = f.bind(ctx) }
        f()
        this.endDebug()
    },
    vectorEllipse( vec, size ) {
        ellipse( vec.x, vec.y, size || this.EllipseSize )
    },
    segment( p1, p2, boundPoints ){
        line ( p1.x, p1.y, p2.x, p2.y )
        if(boundPoints){
            ellipse( p1.x, p1.y, this.EllipseSize )
            ellipse( p2.x, p2.y, this.EllipseSize )
        }
    },
    drawVector( p0, d, t ){
        t ||= 1
        line( p0.x, p0.y, p0.x + d.x * t, p0.y + d.y * t )
    },
    log(...data){
        if(!this.Debug) return
        console.log(...data  )
    }
}
const PRIMITIVE_GLOBALS = {
    Eps: 1e-6 ,
}
const GLOBALS = {
    DefaultGravity: .2,
    DefaultMass: 1,
    DefaultGOSize: 50,
    DefaultBaseDrawMag: 50,
    DefaultMaxAbsVelocity: 4
}

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
