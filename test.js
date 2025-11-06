

class Particle extends GObject {
  constructor( size ){
    super( createVector( width/2, height/2 ) )
    this.activateRigidBody(  )
    this.rigidBody.gravity = createVector(0)
    this.rigidBody.damping = .9
    this.size = size || 20
  }

  update(){
    stroke(255)
    text(`A= x: ${this.rigidBody.acceleration.x}, x: ${this.rigidBody.acceleration.y}`, 50, 50)
    super.update()
    switch (key) {
      case 'w':
        this.rigidBody.addForce( createVector( 0, 1 ) )
        break;
      case 's':
        this.rigidBody.addForce( createVector( 0, -1 ) )
        break;
      case 'd':
        this.rigidBody.addForce( createVector( 1, 0 ) )
        break;
      case 'a':
        this.rigidBody.addForce( createVector( -1, 0 ) )
        break;
      default:
        break;
    }
  }

  draw(){
    ellipse( this.transform.pos.x, this.transform.pos.y, this.size )
  }
}

let part1, part2 
function setup() {
  createCanvas( innerWidth, innerHeight )
  part1 = new Particle(  )
  part2 = new Particle( 100 )
}

function draw() {
  background(0)
  part1.draw() 
  part1.update()
  part2.draw()
  let F = Physics2d.calculateGravityForce( part1.transform.pos, part2.transform.pos, 
    part1.size, part2.size, 1e-4  
   )
  part1.rigidBody.addForce( F.mult(-1) )
}

