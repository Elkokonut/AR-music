import BodyTrackerObject from './BodyTrackerObject';
import * as THREE from 'three';

export default class Occluser extends BodyTrackerObject {
    constructor(keypoint, scale) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial();
        const cube = new THREE.Mesh(geometry, material);
        cube.material.color.set(0x0000ff);
        cube.material.colorWrite = false;

        super(cube, `Occluser_${keypoint.type}_${keypoint.order}`, keypoint, scale);
    }

    animate(distance) {
        super.animate(distance);
        this.obj.position.z = 10;
    }
}