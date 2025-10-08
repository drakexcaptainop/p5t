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
    noLoop()
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


