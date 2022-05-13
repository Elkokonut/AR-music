import * as THREE from "three";
import Keypoint from "../../../Geometry/Keypoint";
import Object3D from "../Object3D";
import Pizzicato from "pizzicato";

export default class Microphone extends Object3D {
  keypoints: Keypoint[];
  sound: Pizzicato.Sound;
  kp_align_pos: THREE.Vector3;
  isPlaying: boolean;
  initialized: boolean;
  static base_dimension_Z = 2.8;

  constructor(obj, name, keypoints, scale) {
    super(obj, name, scale);
    this.initialized = false;
    this.obj.visible = false;
    this.keypoints = keypoints;
    this.sound = null;
    this.kp_align_pos = new THREE.Vector3(0, 0, 0);

    Pizzicato.context.resume();

    this.sound = new Pizzicato.Sound({ source: "input" }, () => this.initialized = true);
    this.sound.addEffect(
      // new Pizzicato.Effects.Reverb({
      //   time: 1,
      //   decay: 0.5,
      //   reverse: true,
      //   mix: 1
      // })
      // new Pizzicato.Effects.Tremolo({
      //   speed: 7,
      //   depth: 0.8,
      //   mix: 0.8
      // })
      //   new Pizzicato.Effects.Distortion({
      //     gain: 0.4
      // })
      new Pizzicato.Effects.Delay({
        feedback: 0.6,
        time: 0.4,
        mix: 0.5
      })
    );
  }

  animate(display) {
    // Compute anchor and kp_align_pos from given keypoints
    //keypoints from hand:
    //          [1]         [3]
    //      align|           |anchor              we want middle points here.
    //          [0]         [2]
    // THUMB HERE


    this.obj.visible = this.keypoints[0].is_visible && display;

    if (this.obj.visible) {
      const anchor = new THREE.Vector3();

      this.kp_align_pos.subVectors(this.keypoints[1].position, this.keypoints[0].position)
        .multiplyScalar(1 / 2)
        .add(this.keypoints[0].position);

      anchor.subVectors(this.keypoints[3].position, this.keypoints[2].position)
        .multiplyScalar(1 / 2)
        .add(this.keypoints[2].position);

      this.obj.position.x = anchor.x;
      this.obj.position.y = anchor.y;
      this.obj.position.z = anchor.z;

      // Get align vector from anchor referential.s
      const align_vector = new THREE.Vector3();
      align_vector.subVectors(this.kp_align_pos, anchor).normalize();
      this.obj.rotation.z = - Math.sign(align_vector.x) * this.obj.up.angleTo(align_vector);
    }
  }
  play_sound(mouth_keypoint) {
    if (this.initialized && mouth_keypoint && this.kp_align_pos.distanceTo(mouth_keypoint.position) < 150 && this.obj.visible) {
      this.sound.play();
    }
    else {
      this.sound.pause();
    }
  }
}
