class World extends Array{
  constructor(){
    super()
  }
  /**
   * 
   * @param {Ray} ray 
   */
  intersectClosestBB( ray ){
    let cd = Infinity
    let ibb = null
    let hp = null
    for(let obj of this){
        let bb = this.hasBB( obj  )
        if(bb){
            let [hasHit, P] = bb.checkHit( ray )
            if(!hasHit) continue
            let dD = p5.Vector.sub( P, ray.r0 ).mag(  )
            if(dD < cd){
                cd = dD 
                ibb = obj
                hp = P
            }
        }
    }
    return  new HitInfo( cd != Infinity, hp, ibb )
  }

  hasBB(obj){
    let bb = null
    for(let item of Object.entries(obj)){
      let hbb = item[1] instanceof BB
      if(hbb){
        bb = hbb
        break
      }
    }
    return bb
  }

  getClosestTo( testObj ){
    for(let obj of this){
      obj
    }
  }
  draw(){
    for(let obj of this){
      obj.drawInTransform(  )
    }
  }

}

class HitInfo{
    constructor(hasHit, P, obj){
        this.hasHit = hasHit 
        this.P = P 
        this.obj = obj 
    }
}