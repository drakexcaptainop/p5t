

class Particle extends GObject {
  constructor(  ){
    super( createVector( width/2, height/2 ) )
    this.activateRigidBody(  )
    this.rigidBody.gravity = createVector(0)
  }

  draw(){
    ellipse( this.transform.pos.x, this.transform.pos.y, 20 )
  }
}

let part 
function setup() {
  createCanvas( innerWidth, innerHeight )
  part = new Particle(  )
}

function draw() {
  background(0)
  part.draw()  
}