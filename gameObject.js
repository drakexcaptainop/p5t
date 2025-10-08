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

class GObject{
    constructor(pos){
        this.transform = new Transform2d( pos )
        this.rigidBody =  new RigidBody( this )
    }
    drawInTransform(){
        push ()
        translate (this.transform.pos)
        rotate (this.transform.zrot)
        translate (p5.Vector.mult(this.transform.pos, -1))
        this.draw ()
        pop ()
    }

    draw(){  }
    drawBase(t){
        t = t || GLOBALS.DefaultBaseDrawMag
        line( this.transform.pos.x, this.transform.pos.y, 
            this.transform.pos.x + this.transform.fwd.x * t,
            this.transform.pos.y + this.transform.fwd.y * t  )
        line( this.transform.pos.x, this.transform.pos.y, 
            this.transform.pos.x + this.transform.right.x * t,
            this.transform.pos.y + this.transform.right.y * t  )
    }
    update(){
        this.rigidBody.update(  )
    }
    deactivateRigidBody(){
        this.rigidBody.active = false
        return this 
    }
    activateRigidBody(){
        this.rigidBody.active = true 
        return this
    }
}

class Ell extends GObject{
    constructor( pos, size ) {
        super( pos )
        this.size = size || GLOBALS.DefaultGOSize
    }
    draw(){
        ellipse(this.transform.pos.x, this.transform.pos.y, this.size)
    }
}

class RigidBody{
    constructor( gameObject, mass ){
        this.velocity = createVector()
        this.gravity = createVector(0, GLOBALS.DefaultGravity)
        this.gameObject = gameObject
        this.mass = mass || GLOBALS.DefaultMass
        this.active = true
        this.maxAbsVelocity = GLOBALS.DefaultMaxAbsVelocity
    }
    massRescale(v){
        return p5.Vector.mult( v, 1/this.mass )
    }
    constrainVelocity(){
        this.velocity = VUtils.clamp( this.velocity, -this.maxAbsVelocity, this.maxAbsVelocity )
    }
    update(){
        if(!this.active) return
        this.velocity.add( this.massRescale( 
            this.gameObject.transform.std2Base( this.gravity )
        ) )
        this.constrainVelocity(  )
        this.gameObject.transform.translate( this.velocity )
    }
    addForce(F){
        if(!this.active) return
        this.velocity.add( this.massRescale( F ) )
    }
}
// T*q = T^-1g





class Transform2d{
    constructor(pos, fwd){
        this.pos = pos
        this.computeBase(fwd || createVector(0, -1))
    }
    computeBase(fwd){
        this.fwd = fwd
        this.right = VUtils.ortho2( fwd )
    }
    computeRot(){
        this.zrot = this.right.heading()
    }
    base2Std(u){
        return VUtils.base2std( this.right, this.fwd, u )
    }

    std2Base(u){
        return VUtils.std2orthobase( this.right, this.fwd, u )
    }
    translate(u, useStandardBasis){
        useStandardBasis = useStandardBasis || false
        if(useStandardBasis){
            this.pos.add( u )
        }else{
            this.pos.add( 
            VUtils.base2std( this.right, this.fwd, u )
            )
        }
    }
    rotate(beta){
        this.computeBase( VUtils.rotate( this.fwd, beta ) )
        this.computeRot()
    }

    transformStd2Base(P, onOrigin){
        let q = onOrigin ? P : p5.Vector.sub( P, this.pos )
        return VUtils.std2orthobase( this.right, this.fwd, q)
    }

    transformBase2Std( P, useStdOrigin ){
        let q = VUtils.base2std( this.right, this.fwd, P )
        return useStdOrigin ? q.add( this.pos ) : q
    }
}