import Object3D from '../Object3D';
import Keypoint from '../../../tools/Keypoint'

export default class BodyTrackerObject extends Object3D {
    keypoint: Keypoint;

    constructor(obj, name, keypoint, scale) {
        super(obj, name, scale);
        this.obj.visible = keypoint.is_visible;
        this.keypoint = keypoint;
    }

    animate() {
        if (this.keypoint.is_visible) {
            this.obj.position.x = this.keypoint.position.x;
            this.obj.position.y = this.keypoint.position.y;
            this.obj.position.z = this.keypoint.position.z;
            this.obj.visible = true;
        }
        else {
            this.obj.visible = false;
        }

    }
}