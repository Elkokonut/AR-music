import * as THREE from "three";
import Keypoint from "../../../Geometry/Keypoint";
import Object3D from "../Object3D";
import Pizzicato from "pizzicato";

export default class Microphone extends Object3D {
  keypoints_left: Keypoint[];
  keypoints_right: Keypoint[];
  mouth_keypoint: Keypoint;
  sound: Pizzicato.Sound;
  kp_align_pos: THREE.Vector3;
  isPlaying: boolean;
  initialized: boolean;
  static base_dimension_Z = 2.8;

  constructor(obj: THREE.Object3D, name, keypoints_left, keypoints_right, mouth_keypoint, scale) {
    super(obj, name, scale);
    this.initialized = false;
    this.obj.visible = false;
    this.keypoints_left = keypoints_left;
    this.keypoints_right = keypoints_right;
    this.mouth_keypoint = mouth_keypoint;
    this.sound = null;
    this.kp_align_pos = new THREE.Vector3(0, 0, 0);

    Pizzicato.context.resume();

    this.sound = new Pizzicato.Sound({ source: "input" }, () => this.initialized = true);
    this.sound.addEffect(
      new Pizzicato.Effects.Reverb({
        time: 1,
        decay: 1,
        reverse: false,
        mix: 0.25
      })
    );
    this.sound.addEffect(
      new Pizzicato.Effects.Quadrafuzz({
        lowGain: 0,
        midLowGain: 0,
        midHighGain: 0,
        highGain: 1,
        mix: 1.0
      })
    );
  }

  animate(display, is_right_hand) {

    // Compute anchor and kp_align_pos from given keypoints
    //keypoints from hand:
    //          [1]         [3]
    //      align|           |anchor              we want middle points here.
    //          [0]         [2]
    // THUMB HERE


    const keypoints = is_right_hand ? this.keypoints_right : this.keypoints_left;
    this.obj.visible = keypoints[0].is_visible && display;

    if (this.obj.visible) {
      const anchor = new THREE.Vector3();

      this.kp_align_pos.subVectors(keypoints[1].position, keypoints[0].position)
        .multiplyScalar(1 / 2)
        .add(keypoints[0].position);

      anchor.subVectors(keypoints[3].position, keypoints[2].position)
        .multiplyScalar(1 / 2)
        .add(keypoints[2].position);

      // Set base of the object to the anchor point
      this.obj.position.x = anchor.x;
      this.obj.position.y = anchor.y;
      this.obj.position.z = anchor.z;

      // Ratio computes the depth of the mic using Z values of pinky and index.
      const ratio = (keypoints[0].z - keypoints[2].z) * 10;
      this.kp_align_pos.add(new THREE.Vector3(0, 0, ratio * -200));

      // Rotate the object to the align point
      this.obj.lookAt(this.kp_align_pos); // The lookAt method align the Z axis of the object with our vector
      this.obj.rotateX(Math.PI / 2); // so now we rotate on the world X axis the object so it is on it's former local Z axis set by lookAt.
      // rotate 80 and not 90 because kp_align_pos goes a bit too far.

    }
  }

  play_sound() {
    this.sound.play();
  }

  pause_sound() {
    this.sound.pause();
  }
}
