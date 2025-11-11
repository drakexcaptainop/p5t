
class PlantShooter extends GObject{
    constructor(shootInterval, bulletObject, ownerObject){
        super()
        this.deactivateRigidBody()
        this.bullets = []
        this.currentTime = 0
        this.shootInterval = shootInterval
        this.bulletObject = bulletObject
        this.ownerObject = ownerObject
        //  DEBUG.log(ownerObject)
        this.transform.pos = createVector(ownerObject.transform.pos.x, ownerObject.transform.pos.y)
    }

    draw(){
        for(let bullet of this.bullets){
            bullet.draw()
        }
    }

    update(){
        this.currentTime += Time.deltaTimeSeconds
        if(this.currentTime > this.shootInterval){
            this.bullets.push( new this.bulletObject(this.ownerObject, this.transform.pos) )
            this.currentTime = 0
            DEBUG.log("pushing bullet")
        }
        let bulletsToDelete = []
        for(let bullet of this.bullets){
            bullet.update()
            if(bullet.outOfBounds()){
                bulletsToDelete.push( bullet )
            }
        }
        ArrayExtensions.deleteObjectsFromArray( this.bullets, bulletsToDelete )
    }

}

class Bullet extends GObject{
    constructor(owner, pos, fwd, rad){
        super(pos)
        this.activateRigidBody()
        this.rad = rad 
        this.rigidBody.gravity = createVector()
        this.owner = owner
        this.fwd = fwd        
        this.transform.pos = createVector( pos.x, pos.y )
        this.rigidBody.damping = .9
        this.rigidBody.maxAbsVelocity = Infinity
        
        
    }
    draw(){
        ellipse (this.transform.pos.x, this.transform.pos.y, 10)
    }
    update(){
        //DEBUG.log(this)
        //DEBUG.log(this.rigidBody.velocity)
        this.rigidBody.addForce( createVector( .5, 0 ) )
        this.rigidBody.update(  )
        let zombsToRemove = []
        for(let zomb of Grid.instance.zombManager){
            let diffx = Math.abs(this.transform.pos.x - zomb.transform.pos.x)
            let diffy = Math.abs(this.transform.pos.y - zomb.transform.pos.y)
            if(Math.sqrt(diffx*diffx+diffy*diffy)<2){
                zombsToRemove.push( zomb )
            } 
        }
        Grid.instance.zombManager.remove( zombsToRemove )
    }
    outOfBounds(){
        return this.transform.pos.y > height || this.transform.pos.y < 0 || this.transform.pos.x > width || this.transform.pos.x<0
    }
}



class Plant extends GObject{
    constructor(pos, width, height){
        super(pos)
        this.width = width
        this.height = height
        this.bb = new BB(this.transform, width, width)
        this.deactivateRigidBody()
        this.bullets = []
        this.t = 0
        this.shootInterval = Math.random() + .1
        this.bulletShooter = new PlantShooter( this.shootInterval, Bullet, this )
    }
    getBoundingBox(){
        return this.bb
    }
    get corner(){
        return p5.Vector.sub( this.transform.pos, createVector(
            -this.width/2, -this.height/2
         ) )
    }
    draw(){
        ellipse (this.transform.pos.x, this.transform.pos.y, this.width)
        this.bulletShooter.draw()
    }

    update(){
        this.bulletShooter.update()
    }
}

