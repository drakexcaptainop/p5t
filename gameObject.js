
class GObject{
    constructor(pos){
        this.transform = new Transform2d( pos )
        this.rigidBody =  new RigidBody( this )
        this.tag = null
    }

    getBoundingBox(){
        return null
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

    onForceRecieved(F){
        this.rigidBody.addForce(F)
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
        this.acceleration = createVector()
        this.damping = 0
    }
    massRescale(v){
        return p5.Vector.mult( v, 1/this.mass )
    }
    constrainVelocity(){
        this.velocity = VUtils.clamp( this.velocity, -this.maxAbsVelocity, this.maxAbsVelocity )
    }
    update(){
        if(!this.active) return
        this.addForce( this.gravity )

        this.velocity.add(this.acceleration)
        this.constrainVelocity(  )
        this.gameObject.transform.translate( this.velocity )
        
        this.velocity.mult( this.damping )
        this.resetAcceleration()
    }
    resetAcceleration(){
        this.acceleration.mult(0)
    }
    addForce(F){
        if(!this.active) return
        let Q = this.gameObject.transform.transformBase2Std( F, false ) 
        this.acceleration.add( this.massRescale( Q ) )
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

    setAngle(alpha){
        let fwd = createVector(cos(alpha), sin(alpha))
        this.computeBase( fwd )
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

class Physics2dForces{
    static calculateGravityForce( P1, P2, m1, m2, G ){
        let r12 = p5.Vector.sub(P2, P1)
        let d = r12.copy().dot(r12)
        return r12.normalize().mult( G * m1 * m2 / d  )
    }

    static calculateDragForce( velocity, dragCoeff1, dragCoeff2 ){
        let speed = velocity.mag()
        let vhat = velocity.copy().normalize()
        return -vhat.mult( dragCoeff1 * speed + dragCoeff2 * speed * speed )
    }

    static calculateSpringForce(k, p0, pf){
        let dP = p5.Vector.sub( pf, p0 )
        let dPh = dP.copy().normalize()
        return p5.Vector.mult( dPh, -k * dP.mag() )
    }
}



if (typeof module !== "undefined") {
    module.exports = {
        Transform2d,
        RigidBody,
        GObject,
        VUtils,
        Physics2dForces
    }
}


