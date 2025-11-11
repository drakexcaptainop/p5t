
function mousePressed(){
    grid.onClick()
}

let grid 
function setup() {
    createCanvas(innerWidth, innerHeight)
    grid = new Grid( 10, 10 )
}

function draw(){
    background( 255 )
    grid.draw()
    grid.updateHover()
    grid.updateUI()
    grid.updateCells()
    grid.updateZombs()
}
