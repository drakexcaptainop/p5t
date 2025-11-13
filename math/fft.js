function dft(X) {
    let N = X.length
    let Xf = new Array(N).fill(0)
    for (let k = 0; k < N; k++) {
        let sum = c(  )
        for (let n = 0; n < N; n++) {
            let f = k/N 
            let angle = -2 * Math.PI * f * n 
            sum = cadd(sum, cscale(cexp( angle ), X[n]))
        }
        Xf[k] = sum
    }
    return Xf
}

// r(t) = (x(t), y(t))
// 

function fourierSeriesParams(X) {
    let A = dft(X)
    return A.map( ak => cscale(ak, 1/X.length) )
}

function fourierSeriesAprox(params) {
    
}

function fft(params) {
    
}