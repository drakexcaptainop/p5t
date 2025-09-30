const DEBUG = {
    Debug: true,
    beginDebug(){
        if(this.Debug) push()
    },
    endDebug(){
        if(this.Debug) pop()
    },
    debug(f, ctx){
        if(ctx){ f = f.bind(ctx) }
        f()
    },
    vectorEllipse( vec ) {
        ellipse( vec.x, vec.y, 40 )
    } 
}
const PRIMITIVE_GLOBALS = {
    Eps: 1e-6 ,
        
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

    intersectCurrentStdBase(  ){
        let Px = this.intersectPlane( createVector( 0, 1 ), createVector(  ) )
        let Py = this.intersectPlane( createVector( 1, 0 ), createVector(  ) )
        return [ Px, Py ]
    } 
    draw(){
        ellipse( this.r0.x, this.r0.y, 40 )
        let rT = this.eval( 100 )
        line ( this.r0.x, this.r0.y, rT.x, rT.y )
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
        let nr0 = this.transform.transformStd2Base( ray.r0, false )
        let nd = this.transform.transformStd2Base( ray.rd, true )
        return new Ray( nr0, nd )
    }
    
    transformRay2Std(ray){
        return new Ray( this.transform.transformBase2Std(  ray.r0, true ), 
            this.transform.transformBase2Std( ray.rd, false ) )
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
    get rightCorner (){
        return createVector( this.widthd2, this.heightd2 ).add( this.transform.pos )
    }

    slabTest(ray){
        /**
         * 
         * ti1 = (min_i - o_i) / d_i
            ti2 = (max_i - o_i) / d_i
            if (ti1 > ti2) swap(ti1, ti2)

            t_enter = max over axes of ti1
            t_exit  = min over axes of ti2
         */
        let corner = this.corner.sub( this.transform.pos )
        let rcorner = this.rightCorner.sub( this.transform.pos )
        let t1s = []
        let t2s = []
        // x
        let t1 = (corner.x - ray.r0.x) / ray.rd.x 
        let t2 = (rcorner.x - ray.r0.x) / ray.rd.x
        if(t1 > t2) { [t1, t2] = [t2, t1] }
        t1s.push( t1 )
        t2s.push( t2 )
        // y
        t1 = (corner.y - ray.r0.y) / ray.rd.y
        t2 = (rcorner.y - ray.r0.y) / ray.rd.y
        if(t1 > t2) { [t1, t2] = [t2, t1] }
        t1s.push( t1 )
        t2s.push( t2 )

        let tenter = Math.max (...t1s)
        let texit = Math.max (...t2s )
        return [texit >= Math.max( 0, tenter), this.transform.transformBase2Std(ray.eval( tenter ), true)]
    }
    checkHit(ray){
        ray.draw()
        let rayB = this.transformRay2Base( ray )
        let [Px, Py] = rayB.intersectCurrentStdBase(  )
        
        let [hasHit, P] = this.slabTest( rayB )
        DEBUG.beginDebug()
        DEBUG.debug( 
            (function() {
                fill (255, 0, 0)
                DEBUG.vectorEllipse( this.transform.transformBase2Std( Px, true ) )
                fill (0, 255, 0)
                DEBUG.vectorEllipse( this.transform.transformBase2Std( Py, true ) )
            }), this
        )
        DEBUG.endDebug()

        
        return [hasHit, P]
    }
    
    getClosest(P, transformToBase){
        let ph = transformToBase ? this.transform.transformStd2Base( P ) : P
        let bp = createVector(
            constrain( ph.x, -this.widthd2, this.widthd2),
            constrain( ph.y, -this.heightd2, this.heightd2 )
         )
        return this.transform.transformBase2Std( bp, true )
    }
    
    get corner(){
        return createVector( -this.widthd2, -this.heightd2 ).add( this.transform.pos )
    }  
    draw(){
        let corner = this.corner
        rect( corner.x, corner.y, this.width, this.height)
    }

}