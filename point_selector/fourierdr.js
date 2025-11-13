let psui 
function setup() {
    createCanvas(innerWidth, innerHeight)
    psui = new PointSelectorUI()
}

function draw() {
    psui.drawAsMesh()
    psui.update()
}

function keyPressed() {
    if(key=='r'){
        psui.close()
        psui.fitApproximator()
        psui.beginDraw()
    }
}

function mousePressed() {
    psui.onClick()
}