import BodyTrackerObject from './BodyTrackerObject.js';
import * as THREE from 'three';

export default class Disk extends BodyTrackerObject {
    constructor(keypoint) {
        const material = new THREE.MeshBasicMaterial({ color: 0x08ECA9 });
        const geometry = new THREE.CircleGeometry(5, 32);
        const circle = new THREE.Mesh(geometry, material);
        super(circle, `Disk_${keypoint.type}_${keypoint.order}`, keypoint, null);
    }
    animate(distance) {
        super.animate(distance);
    }
}