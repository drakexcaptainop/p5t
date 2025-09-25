function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
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
  }
  
}

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
  
  translate(u){
    this.pos.add( 
      VUtils.base2std( u )
    )
  }
  
  rotate(beta){
  }
}