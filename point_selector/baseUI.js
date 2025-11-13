
class PointSelectorUI{
    constructor(){
        this.points = []
        this.t = 0
        this.fourierApprox = new FourierBaseAproximator(  )
        this._beginDraw = false 
    }

    onClick(){
        if(this._beginDraw) return
        this.points.push(
            createVector( mouseX, mouseY )
        )
    }
    fitApproximator(){
        this.fourierApprox.fit( Matrix.copy( this.points.map( v => [v.x, v.y]) ) )
    }
    beginDraw(){
       this._beginDraw = true
       this.clear()
    }
    update(){
        if(!this._beginDraw) return 
        this.t += .05
        let p =  this.fourierApprox.eval( [this.t] )[0]
        this.points.push(createVector( p[0], p[1] ) )
    }

    clear(){
        this.points.splice(0)
        return this
    }
    drawAsMesh(close, fillStyle){
        fillStyle ||= [255]
        beginShape()
        for(let point of this.points){
            vertex(point.x, point.y)
        }
        fill(...fillStyle)
        if(close){
            endShape(CLOSE)
        }else{
            endShape()
        }
    }
    draw(){
        for(let point of this.points){
            ellipse( point.x, point.y, 10 )
        }
    }

    close(){
        this.points.push( this.points[0] )
    }
}