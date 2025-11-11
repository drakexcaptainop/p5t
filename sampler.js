const PROBABILITY_UTILS = {
    kissState: {
        x: 123456789,
        y: 362436000,
        z: 521288629,
        c: 7654321
    },
    randomCache: [],
    _seed: 0,
    _initialState: {
        x: 123456789,
        y: 362436000,
        z: 521288629,
        c: 7654321
    },
    resetRng(){
        this.kissState = this._initialState
        this.setKissSeed(this.seed)
    },
    setKissSeed(seed){
        this._seed = seed
        let base = seed >>> 0
        PROBABILITY_UTILS.kissState = {
            x: base || 123456789,
            y: (base ^ 0xdeadbeef) >>> 0 || 362436000,
            z: (base + 0x1234567) >>> 0 || 521288629,
            c: (base ^ 0xabcdef) >>> 0 || 7654321
        }
        return PROBABILITY_UTILS
    },
    kissUniform(){
        return Math.random()
        let { x, y, z, c } = PROBABILITY_UTILS.kissState
        x = (69069 * x + 12345) >>> 0
        y ^= y << 13
        y ^= y >>> 17
        y ^= y << 5
        let t = (698769069 * z + c) >>> 0
        let carry = ((698769069 * z + c) / 0x100000000) >>> 0
        z = t >>> 0
        c = carry
        PROBABILITY_UTILS.kissState = { x, y, z, c }
        let result = (x + y + z) >>> 0
        return result / 0x100000000
    },
    discreteSample(p){
        let u = this.kissUniform(  )
        let cdf = 0
        for(let i=0; i < p.length; i++){
            cdf += p[i] 
            if(cdf > u){
                return i 
            }
        }
    },
    normalizePmf(p){
        let s = p.reduce( (prev, curr) => prev + curr, 0 )
        let res = [ ]
        for(let i=0; i<p.length; i++){
            res.push( p[i]/s )
        }
        return res
    },
    uniform(N){
        return new Array( N ).fill(1).map( _=>1/N )
    },
    concentratedUniform( N, i, Pr ){
        Pr = Pr || .85
        let rcd = (1 - Pr) / ( N - 1 )
        return this.normalizePmf( this.uniform( N ).map( (_, j) => j==i ? Pr : rcd ) )
    }


}


class HMM{
    constructor(transitionMatrix, emmisionMatrix){
        // TRS[i, j] = p( Z_t = j | Z_{t-1} = i )
        this.TRS = transitionMatrix
        // EMM[i, j] = p(Y_t = j | Z_t = i)
        this.EMM = emmisionMatrix
        this.states = null
        this.observables = null
    }
    sampleEmission(Z_t){
        let dist = this.EMM[Z_t]
        let sampleIndex = PROBABILITY_UTILS.discreteSample( dist )
        return this.observables[ sampleIndex ]
    }
    sampleState( Z_t ){
        let dist = this.TRS[Z_t]
        let sampleIndex = PROBABILITY_UTILS.discreteSample( dist )
        return this.states[ sampleIndex ] 
    }

    setStates( states ){
        this.states = states || new Array( this.TRS.length ).fill(0).map( (_, i) => i )
        return this
    }
    setObservables( observables ){
        this.observables = observables || new Array( this.EMM[0].length ).fill(0).map( (_, i) => i )
        return this
    }
    normalizeEmmisionMatrix(){
        for(let i=0;i<this.states.length;i++){
            this.EMM[i] = PROBABILITY_UTILS.normalizePmf( this.EMM[i] )
        }
        return this 
    }
    normalizeTransitionMatrix(){
        for(let i=0;i<this.states.length;i++){
            this.TRS[i] = PROBABILITY_UTILS.normalizePmf( this.TRS[i] )
        }
        return this
    }
    samplePath(T, Z_0){
        let Z_t = Z_0
        let observablePath = []
        let latentPath = [Z_0]
        for(let i=1; i<=T; i++){
            Z_t = this.sampleState( Z_t )
            let X_t = this.sampleEmission( Z_t )
            observablePath.push( X_t )
            latentPath.push( Z_t )
        }
        return [observablePath, latentPath]
    }
}


class ClassicalDistributions{
    static sampleNormal(u, sigma){
        u = u || 0
        sigma = sigma || 1

        let u1 = 0
        let u2 = 0

        while(u1 === 0){
            u1 = PROBABILITY_UTILS.kissUniform()
        }
        while(u2 === 0){
            u2 = PROBABILITY_UTILS.kissUniform()
        }
        let radius = Math.sqrt(-2 * Math.log(u1))
        let theta = 2 * Math.PI * u2
        let z = radius * Math.cos(theta)
        return z * sigma + u
    }

    static sampleBeta(){
        
    }
}

PROBABILITY_UTILS.setKissSeed( 0 )
for(let i=0; i<1000; i++){
    PROBABILITY_UTILS.randomCache.push( PROBABILITY_UTILS.kissUniform() )
}
PROBABILITY_UTILS.setKissSeed( 0 )

if (typeof module !== "undefined") {
    module.exports = {
        HMM,
        ClassicalDistributions,
        PROBABILITY_UTILS
    }
}
