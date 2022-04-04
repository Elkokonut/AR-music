import * as THREE from 'three';

export default class Object3D {
    obj: THREE.Mesh;
    z: number;
    scale: number[];
    constructor(obj, name, scale) {
        this.obj = obj;
        this.obj.name = name;
        this.z = 0;
        this.scale = [1, 1, 1];
        if (scale)
        {
            this.obj.scale.set(scale[0], scale[1], scale[2]);
            this.scale = scale;
        }

    }

    animate(distance) {
        if (distance) {
            this.obj.scale.x = this.scale[0] * (distance + 1);
            this.obj.scale.y = this.scale[1] * (distance + 1);
            this.obj.scale.z = this.scale[2] * (distance + 1);
        }
    }
}