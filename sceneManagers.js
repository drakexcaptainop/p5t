class BaseSceneManager extends Array{
    constructor(){
        super()
    }
    addObject(object){
        if(!(object instanceof GObject)){
            return null
        }
        this.push( object )
        return this 
    }
}

class DrawableSceneManager extends BaseSceneManager{
    constructor(autoUpdate){
        super()
        this.autoUpdate = autoUpdate 
    }

    draw(){
        for(let obj of this){
            obj.draw()
            this.updateObject( obj )
        }
    }

    updateObject(obj){
        if(this.autoUpdate){
            obj.update(  )
        }
    }

    drawInTransform(){
        for(let obj of this){
            obj.drawInTransform(  )
            this.updateObject( obj )
        }

    }

}

class Physics2dSceneManager extends BaseSceneManager{
    constructor(G){
        super()
        this.G = G || GLOBALS.GravitationalConstant
    }

    calcualteGravityForce(objA, objB){
        return Physics2dForces.calculateGravityForce( objA.transform.pos, objB.transform.pos, objA.rigidBody.mass, objB.rigidBody.mass, this.G )
    }

    checkBBoxInteraction(){
        
    }

    checkSphereInteraction(){

    }

    calculateAndaddGravityForces(objA, objB){
        let F = this.calcualteGravityForce( objA, objB )
        objA.rigidBody.addForce( F )
        objB.rigidBody.addForce( p5.Vector.mult( F, -1 ) )
        return objA, objB, F
    }
    updateGravityForces(){
        for(let i=0;i<this.length;i++){
            for(let j=i+1;j<this.length;j++){
                let objA = this[i]
                let objB = this[j]
                let F = null
                [objA, objB, F] = this.calculateAndaddGravityForces( objA, objB )
                DEBUG.drawVector( objA.transform.pos, F, 100)
                DEBUG.drawVector( objB.transform.pos, p5.Vector.mult( F, -1 ), 100)
            }
        }
    }
}

class PhysicsBasedDrawableSceneManager{
    constructor(G, autoUpdate){
        this.physicsManager = new Physics2dSceneManager( G )
        this.drawableManager = new DrawableSceneManager( autoUpdate )
    }

    addObject( obj ){
        this.physicsManager.addObject( obj )
        this.drawableManager.addObject( obj )
        return this
    }

    draw(){
        this.drawableManager.draw(  )
    }

    updateForces(){
        this.physicsManager.updateGravityForces(  )
    }
}