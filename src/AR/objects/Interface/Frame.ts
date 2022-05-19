import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';



export default class Frame extends Object3D {
    children: Object3D[];
    resizeFunc: (Frame) => void
    onBefore: () => void
    onAfter: () => void

    static distance = 50;

    constructor(frame: ThreeMeshUI.Block, name: string, resizeFunc = null, onBefore = null, onAfter = null) {
        super(frame, name, null);
        this.children = [];
        this.resizeFunc = resizeFunc;
        this.hide();

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

    interact(raycast: THREE.Raycast) {
        const children = this.children.map(c => c.obj);
        const intersects = raycast.intersectObjects(children);
        // let res: string = null;
        this.children.forEach(child => {
            if (child instanceof Button) {
                if (intersects && intersects.find(o => o.object.parent && o.object.parent.name === child.obj.name)) {
                    child.intersect();
                    if (child.selected)
                        this.children.forEach(c => { if (c instanceof Button && c != child) c.selected = false; });
                } else
                    child.onIdle();
            }
            else if (child instanceof Frame) {
                child.interact(raycast);
            }
        });
    }
}