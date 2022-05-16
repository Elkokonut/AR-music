import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';



export default class Frame extends Object3D {
    children: Object3D[];
    private resize_func: (Frame) => void
    onBefore: () => void
    onAfter: () => void

    constructor(frame: ThreeMeshUI.Block, name: string, resize_func: (Frame) => void, onBefore = null, onAfter = null) {
        super(frame, name, null);
        this.children = [];
        this.resize_func = resize_func;
        this.resize();
        this.hide();

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
        this.resize_func(this);
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