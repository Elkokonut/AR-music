import Button from "./Button";
import * as ThreeMeshUI from 'three-mesh-ui';
import * as THREE from 'three';
import Object3D from '../Object3D';
import Toggle from "./Toogle";



export default class Frame extends Object3D {
    children: Object3D[];
    private resize_func: (Frame) => void

    constructor(frame: ThreeMeshUI.Block, name: string, resize_func: (Frame) => void) {
        super(frame, name, null);
        this.children = [];
        this.resize_func = resize_func;
        this.resize();
        this.hide();
    }

    show() {
        this.obj.visible = true;
    }

    hide() {
        this.obj.visible = false;
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
            // else if (child instanceof Toggle) {
            //     if (intersects && intersects.find(o => o.object.parent && o.object.parent.name === child.obj.name)) {
            //         child.onHover();
            //         if (child.counter > 5) {
            //             this.children.forEach(c => { if (c instanceof Button) c.selected = false; });
            //             // res = child.type;
            //         }
            //     } else
            //         child.onIdle();
            // }
        });
    }
}