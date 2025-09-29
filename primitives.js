const PRIMITIVE_GLOBALS = {
    Eps: 1e-6    
}
class Ray{
    constructor(origin, direction){
        this.r0 = origin
        this.rd = direction
    }
    eval(t){
        return p5.Vector.mult( this.rd, t ).add( this.r0 )
    }

    // x'w + b = 0
    // (r0 + rd * t ) ' w  = -b
    // r0' * w + rd ' * w * t = -b
    // t = -(b + r0'* w) / rd' * w
    // t= ( x0-r0 )'*w / rd' * w

    intersectPlane( w, x0 ){
        let t = p5.Vector.sub( x0, this.r0 ).dot( w ) / ( this.rd.dot( w ) )
        return this.eval( t )
    }

    intersectCurrentStdBase( n ){
        let Px = this.intersectPlane( createVector( 1, 0 ), createVector(  ) )
        let Py = this.intersectPlane( createVector( 0, 1 ), createVector(  ) )
        return [ Px, Py ]
    } 
}



class BoundingPrimitive{
    /**
     * 
     * @param {Transform2d} transformParent 
     */
    constructor(transformParent){
        this.transform = transformParent
    }
    /**
     * 
     * @param {Ray} ray 
     */
    transformRay2Base(ray){
        let nr0 = this.transform.transformStd2Base( ray.r0 )
        let nd = this.transform.transformStd2Base( ray.rd, true )
        return new Ray( nr0, nd )
    }

}

class BB extends BoundingPrimitive{
    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Transform2d} transformParent 
     */
    constructor(transformParent, width, height){
        super(transformParent)
        height = height || width
        this.width = width
        this.height = height
        this.widthd2 = width/2
        this.heightd2 = height/2
    }

    checkHit(ray){
        let rayB = this.transformRay2Base( ray )
        let [Px, Py] = rayB.intersectCurrentStdBase(  )
        let onXBound = Px.x < this.widthd2 && Px.x > -this.widthd2
        let onYBound = Py.y < this.heightd2 && Py.y > -this.heightd2
        return [onXBound && onYBound, this.getClosest( createVector( Px.x, Py.y ) )]
    }
    
    getClosest(P){
        let ph = this.transform.transformStd2Base( P )
        let bp = createVector(
            constrain( ph.x, -this.widthd2, this.widthd2),
            constrain( ph.y, -this.heightd2, this.heightd2 )
         )
        return this.transform.transformBase2Std( bp, true )
    }
    
    get corner(){
        return createVector( -this.widthd2, -heightd2 ).add( this.transform.pos )
    }  
    draw(){
        rect( 
            this.corner, this.width, this.height
        )
    }

}