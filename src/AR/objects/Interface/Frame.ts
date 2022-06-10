import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';
import MeshText from "./MeshText";


export enum FrameType {
    StartingFrame,
    Main,
    Big1,
    Big2,
    Big3,
    GO,
    SmallCounter,
    AutoInfo,
    AppInstructions,
    Tutorial,
    TrainingMic,
    TrainingDrum,
    TrainingInfo,
    TrainingMainPanel,
    ClearTraining,
    DeleteLabel,
    ChildFrame
}

export default class Frame extends Object3D {
    static frame_count = 0;

    children: Object3D[];
    type: FrameType;
    resizeFunc: (Frame) => void
    private onBefore: (() => void)[]
    private onAfter: (() => void)[]

    static distance = 50;

    constructor(frame: ThreeMeshUI.Block, type: FrameType, resizeFunc = null) {
        super(frame, `frame_${Frame.frame_count++}`, null);
        this.children = [];
        this.onBefore = [];
        this.onAfter = [];
        this.type = type;
        this.obj.position.setZ(globalThis.APPNamespace.canvasHeight - Frame.distance);
        this.resizeFunc = resizeFunc;

        if (type != FrameType.ChildFrame)
            this.hide();
    }

    show() {
        this.onBefore.forEach(fct => fct());
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
        this.onAfter.forEach(fct => fct());
    }

    addOnBefore(onBefore: () => void) {
        this.onBefore.push(onBefore);
    }

    addOnAfter(onAfter: () => void) {
        this.onAfter.push(onAfter);
    }


    addElement(elmt: Object3D) {
        this.children.push(elmt);
        this.obj.add(elmt.obj);
    }

    resize() {
        this.obj.position.setZ(globalThis.APPNamespace.canvasHeight - Frame.distance);
        if (this.resizeFunc)
            this.resizeFunc(this);
        this.children.forEach(c => {
            if (c instanceof Button || c instanceof Frame || c instanceof MeshText) {
                c.resize();
            }
        });
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
                        if (child.selected) {
                            this.children.forEach(c => { if (c instanceof Button && c != child) c.selected = false; });
                            return true;
                        }
                    } else
                        child.onIdle();
                }
                else if (child instanceof Frame) {
                    const selected = child.interact(raycasts);
                    if (selected == true)
                        return true;
                }
            });
        }
        return false;
    }

    static basicResize(frame, widthPercentage) {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = height / ratio;

        frame.obj.set({
            width: width * widthPercentage,
            borderRadius: width * widthPercentage / 5,
        });
    }

    static resizeWithRatio(frame, widthPercentage, heightPercentage, ratio) {
        const height = Frame.distance;
        const windowRatio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = height / windowRatio;
        let h = heightPercentage * height;
        let w = 1 / ratio * h;
        if (w > width * widthPercentage) {
            w = widthPercentage * width;
            h = ratio * w;
        }
        frame.obj.set({
            width: w,
            height: h,
            borderRadius: 0
        });


    }
}