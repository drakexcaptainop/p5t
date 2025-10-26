

class Particle extends GObject {
  constructor( size, dummy ){
    super( createVector( width/2, height/2 ) )
    this.activateRigidBody(  )
    this.rigidBody.gravity = createVector(0)
    this.rigidBody.damping = .8
    this.rigidBody.mass = size
    this.size = size
    this.dummy = dummy
  }

  draw(){
    ellipse( this.transform.pos.x, this.transform.pos.y, this.size )
  }

  update(){
    if(this.dummy) {
      super.update()
      return
    }
    switch (key) {
      case 'w':
        this.rigidBody.addForce( createVector(0, -5) )
        super.update()
        break;
      case 's':
        this.rigidBody.addForce( createVector(0, 5) )
        super.update()
        break;
      case 'a':
        this.rigidBody.addForce( createVector(-5, 0) )
        super.update()
        break;
      case 'd':
        this.rigidBody.addForce( createVector(5, 0) )
        super.update()
        break;
      default:
        super.update()
        break;
    }
  }
}

let part, part2, part3
let physicsManager, sceneManager
function setup() {
  createCanvas( innerWidth, innerHeight )
  sceneManager = new PhysicsBasedDrawableSceneManager( 10, true )
  part = new Particle( 10 )
  part.transform.pos = createVector(0, 0)
  part2 = new Particle( 10, true )
  part3 = new Particle( 10, true )
  part3.transform.pos = createVector(width*.5, height*.8)
  sceneManager.addObject( part )
  sceneManager.addObject( part2 )
  sceneManager.addObject( part3 )
}
var F
function draw() {
  background(0)
  stroke(255)
  sceneManager.updateForces(  )
  sceneManager.draw(  )
}