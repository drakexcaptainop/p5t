
class ZombManager extends Array{
    /**
     * 
     * @param {Grid} grid 
     */
    constructor(grid){
        super()
        this.grid = grid
        this.spawner = new ZombSpawner(this, 1)
        this.removeQuery = []
    }
    draw(){
        for(let zom of this){
            zom.draw()
        }
    }
    clear(){
        ArrayExtensions.deleteObjectsFromArray(this, this.removeQuery)
        this.removeQuery = []
    }
    remove(zombs){
        this.removeQuery.push(...zombs)
    }
    update(){
        this.spawner.update()
        for(let zom of this){
            zom.update()
        }
    }
}
class ZombSpawner{
    /**
     * 
     * @param {ZombManager} manager 
     * @param {Number} spawnInterval 
     */
    constructor(manager, spawnInterval){
        this.spawnInterval = spawnInterval
        this.t = 0
        this.manager = manager
    }

    update(){
        this.t += Time.deltaTimeSeconds
        if(this.t > this.spawnInterval){
            this.t = 0
            let y = Math.floor(Math.random( )* this.manager.grid.rows) * this.manager.grid.cellHeight
            y = y + this.manager.grid.cellHeight / 2
            let x = width * .7 + this.manager.grid.cellWidth / 2
            this.manager.push( new Zomb( createVector(x, y) ) )
        }
    }
}
class Zomb extends GObject{
    constructor(pos){
        super( pos )
        this.transform.setAngle( PI )
        this.tag = 'zombie'
        this.bb = new BB(this.transform, 50, 50)
        this.width = 50 
        this.height = 50
    }
    get corner(){
        return p5.Vector.sub( this.transform.pos, createVector( this.width/2, this.height/2 ) )
    }
    draw(){
        let c = this.corner 
        rect( c.x, c.y, 50 )
    }

    update(){
        this.transform.translate( createVector( 0, 1 ) )
    }
}