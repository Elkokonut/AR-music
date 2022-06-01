import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import Object3D from '../Object3D';
import Frame from './Frame';
import MeshText from './MeshText';

export default class Button extends Object3D {
    static instancesCounter = 0;
    action: (x) => void;
    selected: boolean;
    counter: number;
    label: MeshText;
    widthRatio: number;
    heightRatio: number;
    marginRatio: number;
    borderRadiusRatio: number;

    constructor(
        widthRatio: number,
        heightRatio: number,
        content: string = null,
        action = null,
        selected = false,
        btnOptions = null,
        hoveredStateAttributes = null,
        idleStateAttributes = null,
        selectedAttributes = null

    ) {
        if (!btnOptions) {
            const height = Frame.distance;
            const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
            const width = height / ratio;
            btnOptions = {
                width: width * widthRatio,
                height: width * heightRatio,
                justifyContent: 'center',
                borderRadius: width * heightRatio / 5,
                offset: 0.05,
                margin: width * heightRatio / 10,
            };
        }

        if (!hoveredStateAttributes)
            hoveredStateAttributes = {
                offset: 0.035,
                backgroundColor: new THREE.Color(0x008080),
                backgroundOpacity: 0.7,
                fontColor: new THREE.Color(0xffffff)
            };

        if (!idleStateAttributes)
            idleStateAttributes = {
                offset: 0.035,
                backgroundColor: new THREE.Color(0x229999),
                backgroundOpacity: 0.5,
                fontColor: new THREE.Color(0xffffff)
            };

        if (!selectedAttributes)
            selectedAttributes = {
                offset: 0.02,
                backgroundOpacity: 1,
                backgroundColor: new THREE.Color(0x12a69e),
                fontColor: new THREE.Color(0xffffff)
            };

        super(new ThreeMeshUI.Block(btnOptions), `button_${Button.instancesCounter++}`, null);


        this.widthRatio = widthRatio;
        this.heightRatio = heightRatio;
        this.marginRatio = this.heightRatio / 10;
        this.borderRadiusRatio = this.heightRatio / 5;
        this.label = new MeshText(content, heightRatio / 5);
        this.obj.add(this.label.obj);

        this.action = action;
        this.counter = 0;

        this.obj.setupState({
            state: 'selected',
            attributes: selectedAttributes,
        });
        this.obj.setupState(
            {
                state: 'hovered',
                attributes: hoveredStateAttributes
            });
        this.obj.setupState(
            {
                state: 'idle',
                attributes: idleStateAttributes
            });
        this.selected = selected;

        if (this.selected) {
            this.onSelected();
        }
        else {
            this.onIdle();
        }
    }

    resize() {
        const height = Frame.distance;
        const ratio = globalThis.APPNamespace.canvasHeight / globalThis.APPNamespace.canvasWidth;
        const width = height / ratio;
        const min = Math.min(height, width);

        this.obj.set({
            width: min * this.widthRatio,
            height: min * this.heightRatio,
            borderRadius: min * this.borderRadiusRatio,
            margin: min * this.marginRatio,
        });
        this.label.resize();
    }

    intersect() {
        this.onHover();
        if (this.counter >= 10 || (this.counter >= 4 && globalThis.APPNamespace.mobileCheck()))
            this.onSelected();
    }

    onHover() {
        this.counter++;
        this.selected = false;
        this.obj.setState('hovered')
    }

    onSelected() {
        this.selected = true;
        this.obj.setState('selected');
        if (this.action)
            this.action.call(this);
    }

    forceIdle() {
        this.counter = 0;
        this.selected = false;
        this.obj.setState("idle");
    }

    onIdle() {
        if (!this.selected) {
            this.counter = 0;
            this.obj.setState("idle");
        }
    }
}