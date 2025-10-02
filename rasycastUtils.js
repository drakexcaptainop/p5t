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
        if(this.hasBB( obj  )){
            let [hasHit, P] = obj.bb.checkHit( ray )
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
    return Object.entries( obj ).some( itm => itm[1] instanceof BB )
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