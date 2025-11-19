
function mousePressed(){
    grid.onClick()
}

let grid 
function setup() {
    createCanvas(innerWidth, innerHeight)
    grid = Grid.initialize(10, 10)
    ScoreUI.initialize()
    PlantSelectionUI.initialize()
}

function draw(){
    background( 255 )
    grid.draw()
    grid.updateHover()
    grid.updateCells()
    grid.updateZombs()
    grid.updateMoney()
    ScoreUI.instance.draw()
    PlantSelectionUI.instance.draw()
}
