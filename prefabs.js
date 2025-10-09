class Ell extends GObject{
    constructor( pos, size ) {
        super( pos )
        this.size = size || GLOBALS.DefaultGOSize
    }
    draw(){
        ellipse(this.transform.pos.x, this.transform.pos.y, this.size)
    }
}


class Rect extends GObject{
  constructor(p, w, h){
    super(p)
    this.bb = new BB( this.transform, w, h )
  }
  draw(){
    this.bb.draw()
  }
}

class Barrel extends GObject{
    constructor(pos, rad, N){
        super( pos )
        this.rad = rad 
        this.diam = rad * 2 
        this.N = N 
        this.rotStep = TWO_PI/this.N
        this.rot = 0
        this.next = 1
        this.target = 0
        this.targetAngle = 0
        this.bulletIndex = 4
        this.currentTurns = 0
    }
    stepState(){
        print('calling step')
        this.target = this.next
        this.next = (this.next + 1) % this.N
        this.currentTurns += this.next === 0
        this.targetAngle = this.target / this.N * ( TWO_PI+this.rotStep  ) 
        print(this.targetAngle, TWO_PI, 0)
    }
    update (){
        this.rot += this.rotStep / 10
        this.rot = Math.min( this.rot, this.targetAngle )
    }
    draw(){
        fill (255, 0, 0, 150)
        DEBUG.vectorEllipse( this.transform.pos, this.diam )
        for(let i=0; i<this.N; i++){
            let pos = createVector( cos( i * this.rotStep + this.rot ),
            sin(i * this.rotStep + this.rot) ).mult(this.rad * .5).add( this.transform.pos )
            if(i==this.bulletIndex) fill (255, 0, 0)
            else fill (0,255,0)
            DEBUG.vectorEllipse( pos, this.diam / this.N )
        }

    }
    step(  ){

    }
}
