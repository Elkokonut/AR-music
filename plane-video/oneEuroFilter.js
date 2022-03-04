function smoothing_factor(t_e, cutoff) {
    r = 2 * Math.PI * cutoff * t_e
    console.log("pi", Math.PI)
    console.log("r", r)
    return r / (r + 1)
}


function exponential_smoothing(a, x, x_prev) {
    return a * x + (1 - a) * x_prev
}

export default class OneEuroFilter2D {
    constructor(x0, y0, t0 = Date.now(), dx0 = 0.0, min_cutoff = 1.0, beta = 0.00001,
        d_cutoff = 1.0) {
        this.xfilter = new OneEuroFilter(x0, t0, dx0 = dx0, min_cutoff = min_cutoff, beta = beta, d_cutoff = d_cutoff);
        this.yfilter = new OneEuroFilter(y0, t0, dx0 = dx0, min_cutoff = min_cutoff, beta = beta, d_cutoff = d_cutoff);
    }

    call(x, y, t = Date.now()) {
        return [this.xfilter.call(x, t), this.yfilter.call(y, t)];
    }

}

class OneEuroFilter {
    constructor(x0, t0 = Date.now(), dx0 = 0.0, min_cutoff = 1.0, beta = 0.00001,
        d_cutoff = 1.0) {
        this.called = false;
        // Initialize the one euro filter.
        // The parameters.
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = d_cutoff;
        // Previous values.
        this.x_prev = x0;
        this.dx_prev = dx0;
        this.t_prev = t0;
    }

    call(x, t = Date.now()) {
        if (!this.called) {
            // console.log("CALL")
            // console.log("x", x)
            // console.log("t", t)
            // console.log("x_prev", this.x_prev)
            // console.log("t_prev", this.t_prev)
            // console.log("dx_prev", this.dx_prev)
            // console.log("min_cutoff", this.min_cutoff)
            // console.log("beta", this.beta)
            // console.log("d_cutoff", this.d_cutoff)
            // Compute the filtered signal.
            let t_e = t - this.t_prev;
            if (t_e > 0) {

                // The filtered derivative of the signal.
                let a_d = smoothing_factor(t_e, this.d_cutoff);
                let dx = (x - this.x_prev) / t_e;
                let dx_hat = exponential_smoothing(a_d, dx, this.dx_prev);


                // The filtered signal.
                let cutoff = this.min_cutoff + this.beta * Math.abs(dx_hat);
                let a = smoothing_factor(t_e, cutoff);
                let x_hat = exponential_smoothing(a, x, this.x_prev);

                // console.log("t_e", t_e)
                // console.log("a_d", a_d)
                // console.log("dx", dx)
                // console.log("dx_hat", dx_hat)
                // console.log("cutoff", cutoff)
                // console.log("a", a)
                // console.log("x_hat", x_hat)

                // Memorize the previous values.
                this.x_prev = x_hat;
                this.dx_prev = dx_hat;
                this.t_prev = t;
                this.called = true;
                return x_hat;
            }
        }
        return x;
    }
}