const DEBUG = {
    Debug: true,
    EllipseSize: 10,
    beginDebug(){
        if(this.Debug) push()
    },
    endDebug(){
        if(this.Debug) pop()
    },
    debug(f, ctx){
        if(!this.Debug) return
        this.beginDebug()
        if(ctx){ f = f.bind(ctx) }
        f()
        this.endDebug()
    },
    vectorEllipse( vec, size ) {
        ellipse( vec.x, vec.y, size || this.EllipseSize )
    },
    segment( p1, p2, boundPoints ){
        line ( p1.x, p1.y, p2.x, p2.y )
        if(boundPoints){
            ellipse( p1.x, p1.y, this.EllipseSize )
            ellipse( p2.x, p2.y, this.EllipseSize )
        }
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
    vectorTo( u ){
        return p5.Vector.sub( u, this.r0 )
    }
    intersectPlane( w, x0 ){
        let t = this.intersectPlaneComponent( w, x0 )
        return this.eval( t )
    }

    intersectPlaneComponent(w, x0){
        return p5.Vector.sub( x0, this.r0 ).dot( w ) / ( this.rd.dot( w ) )
    }
    intersectPlaneComponentBounded(w, x0){
        let t = this.intersectPlaneComponent( w, x0 )
        return t < 0 ? Infinity : t
    }

    intersectCurrentStdBase(  ){
        let Px = this.intersectPlane( createVector( 0, 1 ), createVector(  ) )
        let Py = this.intersectPlane( createVector( 1, 0 ), createVector(  ) )
        return [ Px, Py ]
    } 
    getSphereComponentDiscriminant(center, radius){
        center = createVector( center.x, center.y, center.z )
        let oc = p5.Vector.sub( this.r0, center )
 
        let b = 2 * this.rd.dot( oc )
        let c = oc.dot( oc ) - radius * radius
        
        return b * b - 4 * a * c
    }
    intersectSphereComponent(center, radius){
        let disc = this.getSphereComponentDiscriminant( center, radius )
        if( disc < 0 ) {
            return Infinity
        }
        let sqrtDisc = Math.sqrt( disc )
        let denom = 2 * a
        let t0 = (-b - sqrtDisc) / denom
        let t1 = (-b + sqrtDisc) / denom
        if( t0 > t1 ) {
            [t0, t1] = [t1, t0]
        }
        let eps = PRIMITIVE_GLOBALS.Eps
        let tclosest = Infinity
        if( t0 >= eps ){
            tclosest = t0
        }else if( t1 >= eps ){
            tclosest = t1
        }
        return tclosest
    }
    intersectSphere( center, radius ){
        return this.eval( this.intersectSphereComponent( center, radius ) )
    }
    draw(t){
        ellipse( this.r0.x, this.r0.y, 20 )
        let rT = this.eval( t || 100 )
        line ( this.r0.x, this.r0.y, rT.x, rT.y )
    }

    lookAt( P ){
        this.rd = p5.Vector.sub( P, this.r0 ).normalize()
        return this
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

    checkHit(){

    }
    getClosest(){

    }
}

class BSpherical extends BoundingPrimitive{
    /**
     * 
     * @param {Number} radius 
     * @param {Transform2d} transformParent 
     */
    constructor( radius, transformParent ){
        super( transformParent )
        this.rad = radius
    }
    /**
     * 
     * @param {Ray} ray 
     */
    checkHit(ray){
        let t = ray.intersectSphereComponent( this.transform.pos, this.rad )
        let hasHit = t != Infinity && t > 0
        let P = ray.eval( t )
        return [hasHit, P]
    }
    getClosest( P ){
        let dV = p5.Vector.sub( P, this.transform.pos )
        let t = dV.mag() - this.rad
        let Pt = dV.normalize().mult( t )
        return Pt    
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
    /**
     * 
     * @param {Ray} ray 
     */
    slabTest2(ray){
        // horizontalllllllll 
        // h1
        let t1h = ray.intersectPlaneComponent( createVector( 0, 1 ), createVector(0, this.heightd2 ) )
        let t2h = ray.intersectPlaneComponent( createVector( 0, 1 ), createVector( 0, -this.heightd2 ) )

        //vert
        
        let t1v = ray.intersectPlaneComponent( createVector(1, 0), createVector(this.widthd2,0 ) )
        let t2v = ray.intersectPlaneComponent( createVector(1, 0), createVector( -this.widthd2, 0) )
        let mnth = Math.min( t1h, t2h )
        let mntv = Math.min( t1v, t2v )

        let mxth = Math.max( t1h, t2h )
        let mxtv = Math.max( t1v, t2v )

        let te = Math.max( mnth, mntv )
        let tl = Math.min( mxth, mxtv )

        return [te > 0 && te < tl, this.transform.transformBase2Std( ray.eval( te ), true )]
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
        let rayB = this.transformRay2Base( ray )
        let [Px, Py] = rayB.intersectCurrentStdBase(  )
        
        let [hasHit, P] = this.slabTest2( rayB )

        DEBUG.debug( 
            (function() {
                fill (255, 0, 0)
                DEBUG.vectorEllipse( this.transform.transformBase2Std( Px, true ) )
                fill (0, 255, 0)
                DEBUG.vectorEllipse( this.transform.transformBase2Std( Py, true ) )
            }), this
        )

        
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
    drawInTransform(){
        push ()
        translate (this.transform.pos)
        rotate (this.transform.zrot)
        translate (p5.Vector.mult(this.transform.pos, -1))
        this.draw ()
        pop ()
    }
}
