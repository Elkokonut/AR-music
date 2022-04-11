import * as THREE from 'three';

export default class Object3D {
    obj: THREE.Group;
    scale: number[];
    constructor(obj, name, scale) {
        this.obj = obj;
        if (obj) {
            this.obj.name = name;
            if (scale) {
                this.obj.scale.set(scale[0], scale[1], scale[2]);
                this.scale = scale;
            }
            else
                this.scale = [1, 1, 1];
        }
    }

    animate(distance) {
        if (distance != null) {
            this.obj.scale.x = this.scale[0] * (distance + 1);
            this.obj.scale.y = this.scale[1] * (distance + 1);
            this.obj.scale.z = this.scale[2] * (distance + 1);
        }
    }
}