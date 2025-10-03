const PROBABILITY_UTILS = {
    discreteSample(p){
        let u = Math.random( )
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
        return p.map( v => v/s )
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
    
}