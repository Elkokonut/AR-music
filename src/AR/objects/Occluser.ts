import BodyTrackerObject from './BodyTrackerObject';
import * as THREE from 'three';
import Object3D from './Object3D';

export default class Occluser extends Object3D {
    protected constructor(obj, name) {
        obj.material.color.set(0x0000ff);
        obj.material.colorWrite = false;
        obj.visible = false;

        super(obj, name, null);
    }


    animate(distance) {
        super.animate(distance);
        this.obj.position.z = 30;
    }
}