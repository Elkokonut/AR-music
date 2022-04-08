import { ThisExpression } from "typescript";
import OneEuroFilterMD from "./oneEuroFilter";
import * as THREE from 'three';

export default class Keypoint {
    type: string;
    order: number;

    z: number;

    euroFilter: OneEuroFilterMD;
    position: THREE.Vector3
    is_visible: boolean;

    constructor(type, order) {
        this.type = type;
        this.order = order;

        this.z = 0;

        this.euroFilter = null;
        this.position = new THREE.Vector3(0, 0, 0);

        this.is_visible = false;
    }

    _normalized_to_pixel_coordinates(normalized_values, max_values) {
        /* Converts normalized value pair to pixel coordinates. */

        function is_valid_normalized_value(value) {
            return (value >= 0) && (value <= 1);
        }

        if (normalized_values && max_values && normalized_values.length == max_values.length) {

            const res = [];

            for (let i = 0; i < normalized_values.length; i++) {
                if (!is_valid_normalized_value(normalized_values[i])) {
                    return null;
                }
                res.push(Math.min(Math.floor(normalized_values[i] * max_values[i]), max_values[i] - 1));
            }
            return res;
        }
        return null;
    }

    get_position(keypoint) {
        const width = globalThis.APPNamespace.width;
        const height = globalThis.APPNamespace.height;
        const kp_pix_coord = this._normalized_to_pixel_coordinates([keypoint.x, keypoint.y], [width, height]);
        if (!kp_pix_coord) {
            return null;
        }
        const positions = [(kp_pix_coord[0] - width / 2), - (kp_pix_coord[1] - height / 2), keypoint.z];
        if (this.euroFilter) {
            const estimation = this.euroFilter.call(positions);
            if (estimation) {
                return estimation;
            }
        }
        return positions;
    }

    update(keypoints) {
        let is_visible = false;
        if (keypoints && keypoints[this.type]) {
            const keypoint = keypoints[this.type][this.order];
            const positions = this.get_position(keypoint);
            if (positions) {
                is_visible = true;
                this.position.x = positions[0];
                this.position.y = positions[1];
                this.position.z = 0;
                this.z = positions[2];
                if (!this.euroFilter)
                    this.euroFilter = new OneEuroFilterMD([this.position.x, this.position.y, this.position.z], Date.now(), 0.001, 1.0);
            }
        }
        this.is_visible = is_visible;
    }
}