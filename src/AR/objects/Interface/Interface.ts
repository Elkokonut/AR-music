import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import * as THREE from 'three';
import Frame from "./Frame";
import FrameFactory from "./FrameFactory";

export default class Interface {
    children: Frame[];
    currentFrame: Frame;

    constructor(scene: BodyTrackerScene) {
        this.children = [];
        this.currentFrame = FrameFactory.starting_frame("Welcome! \nPlease use headphones.\n Interact with the interface using your indexes.", this);
        this.addChildren(this.currentFrame, scene);
        this.addChildren(FrameFactory.default_frame(scene, this), scene);
        this.addChildren(FrameFactory.training_instructions(scene, this), scene);
        this.addChildren(FrameFactory.text_frame("1"), scene);
        this.addChildren(FrameFactory.text_frame("2"), scene);
        this.addChildren(FrameFactory.text_frame("3"), scene);
        this.addChildren(FrameFactory.text_frame("GO!"), scene);
        this.currentFrame.show();
        this.resize();
    }

    addChildren(frame: Frame, scene: BodyTrackerScene) {
        this.children.push(frame);
        scene.scene.add(frame.obj);
    }

    resize() {
        this.currentFrame.resize();
    }

    interact(raycast: THREE.Raycast) {
        this.currentFrame.interact(raycast);
    }

    hide() { this.currentFrame.hide(); }
    show() { this.currentFrame.show(); }

    next(index) {
        this.currentFrame.hide();
        this.currentFrame = this.children[index];
        this.currentFrame.show();
        this.resize();
    }
}