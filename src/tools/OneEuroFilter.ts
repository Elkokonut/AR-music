function smoothing_factor(t_e, cutoff) {
    const r = 2 * Math.PI * cutoff * t_e
    return r / (r + 1)
}


function exponential_smoothing(a, x, x_prev) {
    return a * x + (1 - a) * x_prev
}

export default class OneEuroFilterMD {
    filters: OneEuroFilter[];
    
    constructor(entries, t0 = Date.now(), min_cutoff, beta) {
        this.filters = []
        entries.forEach(point => {
            this.filters.push(new OneEuroFilter(point, t0, min_cutoff, beta));
        });
    }

    call(points, t = Date.now()) {
        const res = [];
        const length = points.length < this.filters.length ? points.length : this.filters.length;
        for (let i = 0; i < length; i++)
        {
            res.push(this.filters[i].call(points[i], t));
        }
        return res;
    }

    set_mcoff(min_cutoff) {
        this.filters.forEach(filter => {
            filter.min_cutoff = min_cutoff;
        });
    }

    set_beta(beta) {
        this.filters.forEach(filter => {
            filter.beta = beta;
        });
    }

}

class OneEuroFilter {
    min_cutoff: number;
    beta: number;
    d_cutoff: number;
    x_prev: number;
    dx_prev: number;
    t_prev: number;

    constructor(x0, t0, min_cutoff, beta) {
        // Initialize the one euro filter.
        // The parameters.
        this.min_cutoff = min_cutoff;
        this.beta = beta;
        this.d_cutoff = 0.001; // period in milliseconds, so default to 0.001 = 1Hz
        // Previous values.
        this.x_prev = x0;
        this.dx_prev = 0.0;
        this.t_prev = t0;
    }

    call(x, t = Date.now()) {
        // Compute the filtered signal.
        const t_e = t - this.t_prev;
        if (t_e > this.d_cutoff) {

            // The filtered derivative of the signal.
            const a_d = smoothing_factor(t_e, this.d_cutoff);
            const dx = (x - this.x_prev) / t_e;
            const dx_hat = exponential_smoothing(a_d, dx, this.dx_prev);


            // The filtered signal.
            const cutoff = this.min_cutoff + this.beta * Math.abs(dx_hat);
            const a = smoothing_factor(t_e, cutoff);
            const x_hat = exponential_smoothing(a, x, this.x_prev);

            // Memorize the previous values.
            this.x_prev = x_hat;
            this.dx_prev = dx_hat;
            this.t_prev = t;
            return x_hat;
        }
        return this.x_prev;
    }
}