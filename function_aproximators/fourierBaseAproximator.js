//const { Matrix } = require("../vector")

//const { Matrix } = require("../vector")

class FourierBaseAproximator {
    constructor() {
        this.parameters = null
        this.dimensions = null
        this.N = null
    }
    fit(X){
        let [N, D] = Matrix.shape( X )
        this.N = N
        this.dimensions = D 
        this.parameters = new Array( this.dimensions )
        for(let i=0; i<this.dimensions; i++){
            let Xc = Matrix.column( X, i )
            console.log('Ruinning dft on', Xc)
            let dimdft = fourierSeriesParams( Xc )
            this.parameters[i] = dimdft
        }
        return this
    }
    evalSingle(t, dim){
        let sum = c()
        for(let k=0; k<this.N; k++){
            let ak = this.parameters[dim][k]
            let w = 2*Math.PI*k*t/this.N
            sum = cadd( sum, cmult( ak, cexp( w ) ) )
        }
        return sum        
    }
    eval(T){
        let F = []
        for(let t of T){
            let d = []
            for(let dim=0; dim<this.dimensions; dim++){
                d.push(this.evalSingle( t, dim ).re)
            }
            F.push(d)
        }
        return F 
    }
}