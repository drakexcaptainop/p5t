
class UI{
    constructor(grid){
        this.cols = grid.cols
        this.rows = grid.rows 
        this.grid = grid
    }
    updateHover(){
        let row = Math.floor(mouseX / width * this.cols)
        let col = Math.floor(mouseY / height * this.rows)
        this.currentMousePos[0] = row 
        this.currentMousePos[1] = col
    }
    updateUI(){
        let [row, col] = this.currentMousePos
        if(!(row>=0&&row<this.rows)||!(col>=0&&col<this.cols)) return
        fill(255, 0, 0)
        this[row][col].drawCell()
        fill(255)
    }
}
class Time{
    static _initializationTime = Date.now()
    static get deltaTimeSeconds(){
        return deltaTime / 1000
    }
    static get runningTime(){
        return (Date.now() - Time._initializationTime) / 1000
    }
}   