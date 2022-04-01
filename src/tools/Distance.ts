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
        var pos1 = [this.keypoint_a.x, this.keypoint_a.y, this.keypoint_a.z];
        var pos2 = [this.keypoint_b.x, this.keypoint_b.y, this.keypoint_b.z];
        var res = distance(pos1, pos2);
        res = Math.min(this.in_max, res);
        res = Math.max(this.in_min, res);
        res = (res - this.in_min) * (this.out_max - this.out_min) / (this.in_max - this.in_min) + this.out_min;
        return res;
    }
}