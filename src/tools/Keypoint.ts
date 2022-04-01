import OneEuroFilterMD from "./oneEuroFilter.js";

export default class Keypoint {
    type: string;
    order: number;

    euroFilter: OneEuroFilterMD;

    x: number;
    y: number;
    z: number;

    is_visible: boolean;

    constructor(type, order) {
        this.type = type;
        this.order = order;

        this.euroFilter = null;
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.is_visible = false;
    }

    _normalized_to_pixel_coordinates(normalized_values, max_values) {
        /* Converts normalized value pair to pixel coordinates. */

        function is_valid_normalized_value(value) {
            return (value >= 0) && (value <= 1);
        }

        if (normalized_values && max_values && normalized_values.length == max_values.length) {

            var res = [];

            for (var i = 0; i < normalized_values.length; i++) {
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
        var width = window.APPNamespace.width;
        var height = window.APPNamespace.height;
        var kp_pix_coord = this._normalized_to_pixel_coordinates([keypoint.x, keypoint.y], [width, height]);
        if (!kp_pix_coord) {
            return null;
        }
        var positions = [(kp_pix_coord[0] - width / 2), - (kp_pix_coord[1] - height / 2), keypoint.z];
        if (this.euroFilter) {
            var estimation = this.euroFilter.call(positions);
            if (estimation) {
                return estimation;
            }
        }
        return positions;
    }

    update(keypoints) {
        var is_visible = false;
        if (keypoints && keypoints[this.type]) {
            var keypoint = keypoints[this.type][this.order];
            var positions = this.get_position(keypoint);
            if (positions) {
                is_visible = true;
                this.x = positions[0];
                this.y = positions[1];
                this.z = positions[2];
                if (!this.euroFilter)
                    this.euroFilter = new OneEuroFilterMD([this.x, this.y, this.z], Date.now(), 0.001, 1.0);
            }
        }
        this.is_visible = is_visible;
    }
}