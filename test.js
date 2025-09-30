let transform, ray, bb
function setup() {
  createCanvas(400, 400);
  transform = new Transform2d( createVector( width/2, height/2 )  )
  ray = new Ray( createVector(), createVector(1, 0) )
  bb = new BB( transform, 50, 50 )
}


function draw() {
  background(220);
  ray.rd.x = mouseX
  ray.rd.y = mouseY
  bb.draw()
  let [hasHit, P] = bb.checkHit( ray )
  if(hasHit){
    DEBUG.debug( () => {
        fill(0, 0, 255)
        DEBUG.vectorEllipse( P )
    } )
  }
  
}

function drawRay(ray, t){
  t = t || 100
  ellipse(ray.r0.x, ray.r0.y, 40)
  let rT = ray.eval( t )
  line( ray.r0.x, ray.r0.y, rT.x, rT.y )
}