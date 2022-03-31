import BodyTrackerObject from './BodyTrackerObject.js';
import * as THREE from 'three';

export default class Cube extends BodyTrackerObject {
    constructor(keypoint, scale) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x08ECA9 });
        var cube = new THREE.Mesh(geometry, material);
        super(cube, `Cube_${keypoint.type}_${keypoint.order}`, keypoint, scale);
        this.cube = cube;
    }

    animate(distance) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        super.animate(distance);
    }
}