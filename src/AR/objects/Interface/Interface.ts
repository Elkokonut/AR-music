import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import * as THREE from 'three';
import Frame from "./Frame";
import FrameFactory from "./FrameFactory";

export default class Interface {
    children: Frame[];
    currentFrame: Frame;

    constructor(scene: BodyTrackerScene) {
        this.children = [];
        this.currentFrame = FrameFactory.default_frame(scene);
        this.children.push(this.currentFrame);

        scene.scene.add(this.currentFrame.obj);
        this.currentFrame.show();
        this.resize();
    }

    resize() {
        this.currentFrame.resize();
    }

    interact(raycast: THREE.Raycast) {
        const res = this.currentFrame.interact(raycast);
    }
}