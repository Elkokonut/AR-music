import Object3D from "../Object3D";
import * as THREE from "three";
import { Howl } from 'howler';
import Keypoint from "../../../Geometry/Keypoint";

export default class Drum extends Object3D {
    base_dimension: THREE.Vector3;
    position: THREE.Vector3;
    box: THREE.Box3;
    canplay: boolean;
    sound: Howl;


    constructor(obj, name, position, base_dimension, sound_path) {
        super(obj, name, null);
        this.obj.visible = true;

        const euler = this.obj.up.angleTo(new THREE.Vector3(1, 0, 0));
        if (name == "cymbal")
            this.obj.rotateX(-euler + Math.PI / 2);
        else
            this.obj.rotateX(-euler);

        this.base_dimension = base_dimension;

        this.position = position;

        this.canplay = true;

        this.sound = new Howl({
            src: [sound_path],
            format: ['wav'],
            volume: 1,
        });


        this.refresh_position();
    }

    refresh_position() {
        const width = globalThis.APPNamespace.canvasWidth;
        const height = globalThis.APPNamespace.canvasHeight;


        this.obj.position.setX(this.position.x / 10 * width / 2)
            .setY(this.position.y / 10 * height / 2)
            .setZ(this.position.z / 10 * height / 2);

        this.obj.scale.setX(this.base_dimension.x * (width + height) / 2)
            .setY(this.base_dimension.y * height)
            .setZ(this.base_dimension.z * height);

        this.box = new THREE.Box3().setFromObject(this.obj);
        this.box.min.setZ(-1);
        this.canplay = true;
    }

    animate(colliders) {
        let collision = false;
        colliders.forEach(collider => {
            if (collider instanceof Keypoint && collider.is_visible)
                collision = collision || this.box.containsPoint(collider.position);
        });

        if (collision) {
            if (this.canplay) {
                this.sound.play();
            }
            this.canplay = false;
        }
        else {
            this.canplay = true;
        }
    }
}
