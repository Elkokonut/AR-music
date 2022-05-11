import * as THREE from "three";

export default function rotateTowards(obj, kp_align_pos) {
    const local_kp_align_pos = new THREE.Vector3();
    local_kp_align_pos.subVectors(kp_align_pos, obj.position).normalize();
    obj.rotation.z = -Math.sign(local_kp_align_pos.x) * obj.up.angleTo(local_kp_align_pos);
}