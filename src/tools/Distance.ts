import { distance } from "mathjs";
import Keypoint from "./Keypoint";


export default class Distance {
    keypoint_a: Keypoint;
    keypoint_b: Keypoint;

    out_min: number;
    out_max: number;
    in_min: number;
    in_max: number;

    constructor(keypoint_a, keypoint_b, out_min, out_max, in_min, in_max) {
        this.keypoint_a = keypoint_a;
        this.keypoint_b = keypoint_b;
        this.out_min = out_min;
        this.out_max = out_max;
        this.in_min = in_min;
        this.in_max = in_max;
    }

    getValue() {
        const pos1 = [this.keypoint_a.position.x, this.keypoint_a.position.y, this.keypoint_a.z];
        const pos2 = [this.keypoint_b.position.x, this.keypoint_b.position.y, this.keypoint_a.z];
        let res = distance(pos1, pos2) as number;
        res = Math.min(this.in_max, res);
        res = Math.max(this.in_min, res);
        res = (res - this.in_min) * (this.out_max - this.out_min) / (this.in_max - this.in_min) + this.out_min;
        return res;
    }

    static getDistance(vector1, vector2, in_interval, out_interval) {
        const pos1 = [vector1.x, vector1.y, vector1.z];
        const pos2 = [vector2.x, vector2.y, vector2.z];
        let res = distance(pos1, pos2) as number;
        res = Math.min(in_interval[1], res);
        res = Math.max(in_interval[0], res);
        res = (res - in_interval[0]) * (out_interval[1] - out_interval[0]) / (in_interval[1] - in_interval[0]) + out_interval[0];
        return res;
    }
}