import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';


export enum FrameType {
    StartingFrame,
    Main,
    Big1,
    Big2,
    Big3,
    GO,
    SmallCounter,
    TrainingMic,
    TrainingDrum,
    TrainingInfo,
    TrainingMainPanel,
    ClearTraining,
    ChildFrame
}

export default class Frame extends Object3D {
    static frame_count = 0;

    children: Object3D[];
    type: FrameType;
    resizeFunc: (Frame) => void
    onBefore: () => void
    onAfter: () => void

    static distance = 50;

    constructor(frame: ThreeMeshUI.Block, type: FrameType, resizeFunc = null, onBefore = null, onAfter = null) {
        super(frame, `frame_${Frame.frame_count++}`, null);
        this.children = [];
        this.resizeFunc = resizeFunc;

        if (type != FrameType.ChildFrame)
            this.hide();

        this.type = type;

        const distance = 50;
        this.obj.position.setZ(globalThis.APPNamespace.canvasHeight - distance);

        this.onBefore = onBefore;
        this.onAfter = onAfter;
    }

    show() {
        if (this.onBefore)
            this.onBefore();
        this.obj.visible = true;
        this.children.forEach(child => {
            if (child instanceof Frame) {
                child.show();
            }
        });
    }

    hide() {
        this.obj.visible = false;

        this.children.forEach(child => {
            if (child instanceof Button) {
                child.forceIdle();
            }
            else if (child instanceof Frame) {
                child.hide();
            }
        });

        if (this.onAfter)
            this.onAfter();
    }


    addElement(elmt: Object3D) {
        this.children.push(elmt);
        this.obj.add(elmt.obj);
    }

    resize() {
        this.obj.position.setZ(globalThis.APPNamespace.canvasHeight - Frame.distance);
        if (this.resizeFunc)
            this.resizeFunc(this);
    }

    interact(raycasts: THREE.Raycast[]) {
        if (raycasts && raycasts.length > 0) {
            const children = this.children.map(c => c.obj);
            const intersects1 = raycasts[0].intersectObjects(children);
            const intersects2 = raycasts.length > 1 ? raycasts[1].intersectObjects(children) : null;

            this.children.forEach(child => {
                if (child instanceof Button) {
                    if ((intersects1 && intersects1.find(o => o.object.parent && o.object.parent.name === child.obj.name))
                        || (intersects2 && intersects2.find(o => o.object.parent && o.object.parent.name === child.obj.name))) {
                        child.intersect();
                        if (child.selected)
                            this.children.forEach(c => { if (c instanceof Button && c != child) c.selected = false; });
                    } else
                        child.onIdle();
                }
                else if (child instanceof Frame) {
                    child.interact(raycasts);
                }
            });
        }
    }
}