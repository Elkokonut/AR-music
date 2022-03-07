function smoothing_factor(t_e, cutoff) {
    var r = 2 * Math.PI * cutoff * t_e
    return r / (r + 1)
}


function exponential_smoothing(a, x, x_prev) {
    return a * x + (1 - a) * x_prev
}

export default class OneEuroFilter2D {
    constructor(x0, y0, t0 = Date.now(), dx0 = 0.0, min_cutoff = 1.0, beta = 0.00001,
        d_cutoff = 1.0) {
        this.xfilter = new OneEuroFilter(x0, t0, dx0, min_cutoff, beta, d_cutoff);
        this.yfilter = new OneEuroFilter(y0, t0, dx0, min_cutoff, beta, d_cutoff);
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
            // Compute the filtered signal.
            var t_e = t - this.t_prev;
            if (t_e > 0) {

                // The filtered derivative of the signal.
                var a_d = smoothing_factor(t_e, this.d_cutoff);
                var dx = (x - this.x_prev) / t_e;
                var dx_hat = exponential_smoothing(a_d, dx, this.dx_prev);


                // The filtered signal.
                var cutoff = this.min_cutoff + this.beta * Math.abs(dx_hat);
                var a = smoothing_factor(t_e, cutoff);
                var x_hat = exponential_smoothing(a, x, this.x_prev);

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