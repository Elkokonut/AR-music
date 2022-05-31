import { distance } from "mathjs";


export default class Distance {

    static getWorldDistance(vector1, vector2): number {
        const pos1 = [vector1.x, vector1.y, vector1.z];
        const pos2 = [vector2.x, vector2.y, vector2.z];
        return distance(pos1, pos2) as number;
    }

    static intervalChange(number, in_interval, out_interval) {
        let res = (number - in_interval[0]) * (out_interval[1] - out_interval[0]) / (in_interval[1] - in_interval[0]) + out_interval[0];
        return res;
    }

    static getDistance(vector1, vector2, in_interval, out_interval): number {
        let res = Distance.getWorldDistance(vector1, vector2);
        if (in_interval && out_interval) {
            res = Distance.intervalChange(res, in_interval, out_interval);
        }
        return res;
    }
}