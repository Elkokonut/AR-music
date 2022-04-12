import BodyTrackerObject from './BodyTrackerObject';
import * as THREE from 'three';

export default class Occluser extends BodyTrackerObject {
    private constructor(keypoint, obj) {
        obj.material.color.set(0x0000ff);
        obj.material.colorWrite = false;

        super(obj, `Occluser_${keypoint.type}_${keypoint.order}`, keypoint, null);
    }

    static phalanx(keypoint) {
        const geometry = new THREE.CylinderGeometry(10, 10, 50, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const cylinder = new THREE.Mesh(geometry, material);

        return new Occluser(keypoint, cylinder);
    }

    palm(keypoint) {

    }
    animate(distance) {
        super.animate(distance);
        this.obj.position.z = 30;
    }
}