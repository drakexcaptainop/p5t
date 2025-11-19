class Money extends GObject {
    constructor( pos, rad ){
        super(pos)
        this.rad = rad 
        this.step = 0
        this.rad2 = this.rad * this.rad
        this.deactivateRigidBody()
    }
    update(){
        let dt = Time.deltaTimeSeconds
        let m = createVector( 0, -1 )
        this.transform.translate(m, false)
    }
    draw(){
        ellipse( this.transform.pos.x, this.transform.pos.y, this.rad * 2  )
    }
    get isCursorOnBounds(){
        let dx = this.transform.pos.x - mouseX 
        let dy = this.transform.pos.y - mouseY 
        let dMag2 = (dx * dx + dy * dy)
        return dMag2 < this.rad2
    }
}

class MoneySpawner{
    constructor(){
        this.grid = Grid.instance
        this.spawnInterval = 1
        this.minSpawnTimeInterval = 3
        this.maxSpawnTimeInterval = 5
        this.currentTime = 0
        this.setSpawnInterval()
    }
    setSpawnInterval(){
        this.spawnInterval = Math.random() * (this.maxSpawnTimeInterval - this.minSpawnTimeInterval) + this.minSpawnTimeInterval
    }
    spawn(){
        let xs = Math.random() * width 
        let ys = Math.random() * (-this.rad - 10)

        return new Money( createVector( xs, ys ), 20 )
    }
    update(){
        this.currentTime += Time.deltaTimeSeconds
        if(this.currentTime > this.spawnInterval){
            this.setSpawnInterval()
            this.currentTime = 0
            return this.spawn(  )
        }
    }
}

class MoneyManager extends Array{
    constructor(){
        super()
        this.spawner = new MoneySpawner()
        this.deleteQueue = []
    }
    draw(){
        for(let mn of this){
            mn.draw()
        }
    }
    update(){
        let obj = this.spawner.update()
        if(obj) this.push( obj )
        for(let mn of this){
            DEBUG.log("cursor ", mn.isCursorOnBounds)
            if(mn.isCursorOnBounds){
                this.deleteQueue.push( mn )
                ScoreUI.instance.update(  )
                DEBUG.log("cursor on bounds adding to delete queue")
            }
            mn.update()
        }
    }
    clear(){
        ArrayExtensions.deleteObjectsFromArray( this, this.deleteQueue )
        this.deleteQueue.splice(0)
    }
}