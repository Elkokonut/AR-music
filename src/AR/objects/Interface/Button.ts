import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import Object3D from '../Object3D';

export default class Button extends Object3D {
    static instancesCounter = 0;
    action: (x) => void;
    selected: boolean;
    counter: number;

    constructor(
        content: string = null,
        action = null,
        selected = false,
        btnOptions = null,
        hoveredStateAttributes = null,
        idleStateAttributes = null,
        selectedAttributes = null
    ) {
        if (!btnOptions)
            btnOptions = {
                width: 1,
                height: 1,
                justifyContent: 'center',
                borderRadius: 0.2,
                offset: 0.05,
                margin: 0.02,
            };

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
        this.obj.add(new ThreeMeshUI.Text({ content: content }));

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

    intersect() {
        this.onHover()
        if (this.counter >= 10)
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