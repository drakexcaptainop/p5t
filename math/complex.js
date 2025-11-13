function complex(re, im) {
    im ||= 0
    re ||= 0
    return { re, im }
}

function c(re, im) {
    return complex(re, im)
}

function cadd(a, b) {
    return c( a.re + b.re, b.im + a.im )
}

function csub(a, b) {
    return c( a.re - b.re, a.im - b.im )
}

//i = sqrt(-1), i^2 = -1
//( ar + ai ) * ( br + bi )
//( ar * br + ar * bi + ai * br + ai * ( bi) )
//{ re: ar * br - ai * bi, im: ar * bi + ai * br }

function cmult(a, b) {
    return c( a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re )
}

function cscale(a, t) {
    return c( a.re * t, a.im * t )
}

// exp(wi) = cos(w) + i*sin(w)
function cexp(w) {
    return c(Math.cos(w), Math.sin(w))
}