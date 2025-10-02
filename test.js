let transform, ray, bb, world, origin
function setup() {
  createCanvas(800, 800);
  transform = new Transform2d( createVector( width/2, height/2 )  )
  ray = new Ray( createVector(), createVector(1, 0) )
  bb = new BB( transform, 50, 50 )
  world = new World(  )
  world.push( new Rect( createVector( width/2, height/2 ), 50, 50 ), 
  new Rect( createVector( width *.2, height*.8 ), 50, 50 ),
  new Rect( createVector( width * .8, height * .1 ), 50, 50 ))
  origin = createVector(  )
}

N =1000
function draw() {
  background(255);
  world.draw()  
  world.forEach( o => o.transform.rotate( -PI/100 ) )
  origin.x = mouseX 
  origin.y = mouseY
  strokeWeight(1)
  stroke(0)
  let step = TWO_PI / N
  for(let i=0; i<N; i++){
    let ray = new Ray( origin, createVector( 
      cos( i * step ),
      sin( i * step )
     ) )
     let hitInfo = world.intersectClosestBB( ray )
          ray.draw( 10000 )
    if(hitInfo.hasHit){
      DEBUG.debug( 
        () => {
          let t = DEBUG.EllipseSize
          DEBUG.EllipseSize = 25
          strokeWeight(5)
          fill (0, 0, 255)
          DEBUG.segment( hitInfo.P, ray.r0, true )
          DEBUG.EllipseSize = t
        }
       )
      
    }
  }
}

function mousePressed(){
  origin.x = mouseX 
  origin.y = mouseY
}



