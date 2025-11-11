class Grid extends Array{
    static instance = null
    constructor( rows, cols ){
        super( rows )
        if(Grid.instance){
            throw new Error("instance already created")
        }
        this.rows = rows 
        this.cols = cols 
        this.cellWidth = width / this.cols
        this.cellHeight = height / this.rows
        this.fill(0)
        this._initializeGrid()
        this.currentMousePos = [0, 0]
        this.zombManager = new ZombManager(this)
        Grid.instance = this
    }
    _initializeGrid(){
        for(let i=0; i<this.cols; i++){
            this[i] = new Array( this.cols ).fill(0).map( (_, j) => new Cell( 
                createVector( this.cellWidth *i, this.cellHeight * j), this.cellWidth, this.cellHeight
             ) )
        }
        return this
    }

    draw(){
        this.drawCells()
        this.zombManager.draw()
    }

    drawCells(){
        let maxAxis = Math.max( this.rows, this.cols )
        for(let i=0;  i<maxAxis; i++){
            let cx = this.cellWidth * i 
            let cy = this.cellHeight * i
            if(i < this.rows){
                line (0, cy, width, cy)
            }
            if(i < this.cols){
                line (cx, 0, cx, height)
            }
        }
        for(let i=0; i<this.rows; i++){
            for(let j=0; j<this.cols; j++){
                let cell = this[i][j]
                cell.drawDrawableObject()
            }
        }
    }

    updateCells(){
        for(let i=0; i<this.rows; i++){
            for(let j=0; j<this.cols; j++){
                let cell = this[i][j]
                cell.update()
            }
        }
        this.zombManager.clear()
    }

    updateHover(){
        let row = Math.floor(mouseX / width * this.cols)
        let col = Math.floor(mouseY / height * this.rows)
        this.currentMousePos[0] = row 
        this.currentMousePos[1] = col
    }

    get mouseGridPosition(){
        let row = Math.floor(mouseX / width * this.cols)
        let col = Math.floor(mouseY / height * this.rows)
        return [row, col]
    }
    onClick(){
        let [row, col] = this.mouseGridPosition
        if(col >= this.cols || row >= this.cols) return
        let cell = this[row][col]
        cell.attachDrawable( Plant )
    }

    updateZombs(){
        this.zombManager.update()
    }

    updateUI(){
        let [row, col] = this.mouseGridPosition
        if(col >= this.cols || row >= this.cols) return
        stroke( 255, 0, 0 )
        this[row][col].drawCell()
        stroke(0)
    }
    
}

class Cell extends GObject{
    constructor( corner, width, height, value, drawable ){
        super( p5.Vector.add( corner, createVector( width/2, height/2 ) ) )
        this.deactivateRigidBody()
        this.value = value 
        this.drawable = drawable 
        this.width = width
        this.height = height
        this.corner = createVector( corner.x, corner.y )
        this.timeToClear = 10
        this.t = 0
    }
    attachDrawable(obj){
        this.drawable = new obj( 
            createVector( this.transform.pos.x, this.transform.pos.y), this.width * .4, this.height * .4 )
    }


    _setDrawableParentToThis(){
        this.drawable.transform = this.transform
        let bb = this.drawable.getBoundingBox()
        if(bb) bb.transform = this.transform
    }
    drawCell(){
        rect (this.corner.x, this.corner.y, this.width, this.height)
    }

    drawDrawableObject(){
        if(this.drawable){
            this.drawable.draw(  )
        }
    }
    draw(){
        this.drawCell()
        this.drawDrawableObject()
    }
    update(){
        this.t += Time.deltaTimeSeconds
        if(this.t > this.timeToClear){
            this.t = 0
            this.drawable = null
        }
        if(this.drawable){
            this.drawable.update()
        }
    }
}


