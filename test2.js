let barrel, hmm, currentLState = 0
function setup() {
    createCanvas(600, 600)
    barrel = new Barrel( createVector( width/2, height/2 ), 200, 5 )
    barrel.deactivateRigidBody()
    
    hmm = new HMM( [
        [.95, .05],
        [.05, .95]
    ], [
        PROBABILITY_UTILS.uniform( 5 ),
        PROBABILITY_UTILS.concentratedUniform( 5, 2, 70 )
    ] ).setObservables().setStates()
}

function draw(){
    background(255)
    stroke(0)
    barrel.draw()
    barrel.update()
}

function mousePressed(){
    let [obs, lnt] = hmm.samplePath( 1, currentLState )
    currentLState = lnt[lnt.length-1]
    if(obs[0]==barrel.bulletIndex){
        noLoop()
        background(255)
        stroke ( 0 )
        text ( "LOST", width/2, height/2 )
    }
    barrel.stepState()
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
    }
    stepState(){
        print('calling step')
        this.target = this.next
        this.next = (this.next + 1) % this.N 
        this.targetAngle = this.target / this.N * TWO_PI 
    }
    update (){
        print(this.rot, this.targetAngle )
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
            else fill (255,0,0)
            DEBUG.vectorEllipse( pos, this.diam / this.N )
        }

    }
    step(  ){

    }
}
