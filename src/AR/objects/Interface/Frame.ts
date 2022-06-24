import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';
import MeshText from "./MeshText";


export enum FrameType {
    StartingFrame,
    Main,
    Ready,
    Set,
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
    order: number;
    resizeFunc: (Frame) => void
    private onBefore: (() => void)[]
    private onAfter: (() => void)[]
    private onDelete: (() => void)[]

    static distance = 50;

    constructor(frame: ThreeMeshUI.Block, type: FrameType, resizeFunc = null, order = 0) {
        super(frame, `frame_${Frame.frame_count++}`, null);
        this.children = [];
        this.onBefore = [];
        this.onAfter = [];
        this.onDelete = [];
        this.type = type;
        this.order = order;
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

    delete() {
        this.children.forEach(child => {
            if (child instanceof Frame) {
                child.delete();
            }
        });
        this.onDelete.forEach(fct => fct());
    }

    addOnBefore(onBefore: () => void) {
        this.onBefore.push(onBefore);
    }

    addOnAfter(onAfter: () => void) {
        this.onAfter.push(onAfter);
    }

    addOnDelete(onAfter: () => void) {
        this.onDelete.push(onAfter);
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