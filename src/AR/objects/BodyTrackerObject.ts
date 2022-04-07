import Object3D from './Object3D';
import Keypoint from '../../tools/Keypoint'

export default class BodyTrackerObject extends Object3D {
    keypoint: Keypoint;
    
    constructor(obj, name, keypoint, scale) {
        super(obj, name, scale);
        this.obj.visible = keypoint.is_visible;
        this.keypoint = keypoint;
    }

    animate(distance) {
        if (this.keypoint.is_visible)
        {
            this.obj.position.x = this.keypoint.x;
            this.obj.position.y = this.keypoint.y;
            this.z = 0;
            this.obj.visible = true;
            super.animate(distance);
        }
        else {
            this.obj.visible = false;
        }

    }
}