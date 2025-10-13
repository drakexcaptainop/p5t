let barrel, hmm, currentLState = 0
let tri
function setup() {
    createCanvas(600, 600)
    barrel = new Barrel( createVector( width/2, height/2 ), 200, 5 )
    barrel.deactivateRigidBody()
    tri = new Triangle( 
        createVector( width * .2, height * .2 ),
        createVector( width/2, height/2 ),
        createVector( width * .8, height * .2 ),

     )
    hmm = new HMM( [
        [.95, .05],
        [.05, .95]
    ], [
        PROBABILITY_UTILS.uniform( 5 ),
        PROBABILITY_UTILS.concentratedUniform( 5, 2, 70 )
    ] ).setObservables().setStates()
    tri.deactivateRigidBody()
}

function draw(){
    background(255)
    tri.transform.rotate( PI/100 )
    tri.drawInTransform()
    fill (0)
    DEBUG.vectorEllipse( tri.transform.pos, 50 )
    //barrel.draw()
    //barrel.update()
}

function mousePressed(){
    let [obs, lnt] = hmm.samplePath( 1, currentLState )
    currentLState = lnt[lnt.length-1]
    if(obs[0]==barrel.bulletIndex){
        
    }
    barrel.stepState()
}


