import BodyTrackerScene from "../../scenes/BodyTrackerScene";
import * as THREE from 'three';
import Frame, { FrameType } from "./Frame";
import FrameFactory from "./FrameFactory";

export default class Interface {
    children: Frame[];
    currentFrame: Frame;

    constructor(scene: BodyTrackerScene) {
        this.children = [];
        FrameFactory.generateAllFrames(scene, this).forEach(frm => this.addChild(frm, scene));

        this.currentFrame = this.findFrameByType(FrameType.StartingFrame);
        this.currentFrame.show();
        this.resize();
    }

    addChild(frame: Frame, scene: BodyTrackerScene) {
        this.children.push(frame);
        scene.scene.add(frame.obj);
    }


    removeChild(frame: Frame, scene: BodyTrackerScene) {
        this.children = this.children.filter(function (obj) {
            return obj != frame;
        });
        scene.removeByName(frame.obj.name);
    }

    resize() {
        this.children.forEach(c => c.resize());
    }

    interact(raycasts: THREE.Raycast[]) {
        this.currentFrame.interact(raycasts);
    }

    hide() { this.currentFrame.hide(); }
    show() { this.currentFrame.show(); }


    findFrameByType(type: FrameType) {
        return this.children.find(frm => frm.type == type);
    }

    next(type: FrameType) {
        let newFrame;
        if (type == FrameType.Tutorial) {
            if (this.currentFrame.type == FrameType.Tutorial) {
                newFrame = this.children.find(frm => frm.type == type && frm.order == this.currentFrame.order + 1);
            }
            else {
                newFrame = this.children.find(frm => frm.type == type && frm.order == 0);
            }
        }
        else if (type == FrameType.SmallCounter) {
            if (this.currentFrame.type == FrameType.SmallCounter) {
                const content = +this.currentFrame.obj.children[1].content - 1;
                newFrame = this.children.find(frm => frm.type == type && frm.obj.children[1].content == `${content}`);
            }
            else {
                newFrame = this.children.find(frm => frm.type == type && frm.obj.children[1].content == "10");
            }
        }
        else {
            newFrame = this.findFrameByType(type);
        }
        if (newFrame) {

            this.currentFrame.hide();
            this.currentFrame = newFrame;
            this.currentFrame.show();
        }
    }
}