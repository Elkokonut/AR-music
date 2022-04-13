import Occluser from "./Occluser";
import * as THREE from 'three';
import Keypoint from "../../tools/Keypoint";
import Distance from "../../tools/Distance";
import Rotate from "../../tools/rotate_towards";


export default class Phalanx extends Occluser {
    anchor: Keypoint;
    align_kp: Keypoint;

    constructor(anchor, align_kp)
    {
        const geometry = new THREE.CapsuleGeometry(10, 20, 4, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const cylinder = new THREE.Mesh(geometry, material);
        super(cylinder, ""); 

        this.anchor = anchor;
        this.align_kp = align_kp;
    }


    animate() {
    this.obj.position.x = this.anchor.position.x;
    this.obj.position.y = this.anchor.position.y;
    this.obj.position.z = this.anchor.position.z;

    this.obj.visible = this.anchor.is_visible;
    // Get align vector from anchor referential.s
    Rotate(this.obj, this.align_kp.position);

    const distance = Distance.getDistance(this.anchor.position, this.align_kp.position, [20, 60], [-0.9999999, 1])
    super.animate(distance);
    }
}