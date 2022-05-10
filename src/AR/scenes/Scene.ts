import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Drum from '../objects/Instruments/Drum';
import Microphone from '../objects/Instruments/Microphone';
import Interface from '../objects/Interface/Interface';
import Object3D from '../objects/Object3D';

export default class Scene {
    video: HTMLVideoElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    #renderOrder: number;
    controls: OrbitControls;
    initialisation: boolean;
    objects: Object3D[];

    constructor(video, debug) {
        this.video = video;
        this.controls = null;
        this.initialisation = false;
        this.#renderOrder = 10;
        this.objects = []
        console.log("Init Scene");
        const ratio = window.innerWidth / this.video.videoWidth;
        const renderheight = ratio * this.video.videoHeight;

        globalThis.APPNamespace.height = renderheight;
        globalThis.APPNamespace.width = window.innerWidth;

        this.scene = new THREE.Scene();
        const texture = new THREE.VideoTexture(this.video);
        texture.center.set(0.5, 0.5);
        texture.repeat.set(-1, 1);
        this.scene.background = texture;
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / renderheight, 0.1, renderheight + 500);
        // this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, .1, 1000);
        this.camera.position.z = renderheight;
        this.camera.lookAt(0, 0, 0);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);

        const light1 = new THREE.PointLight();
        light1.position.set(0.8, 1.4, renderheight + 5);
        this.scene.add(light1);

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, renderheight);
        document.body.appendChild(this.renderer.domElement);
        document.querySelector('canvas').setAttribute("id", "scene");

        if (debug) {
            this.addControls();
            this.addGridHelper();
        }
        this.initialisation = true;
    }

    resize() {
        let width = window.innerWidth;
        const ratio = window.innerWidth / this.video.videoWidth;
        let height = ratio *this.video.videoHeight;

        const min = 150;

        if (height < min)
        {
            height = min;
            width = min /ratio;
        }

        globalThis.APPNamespace.height = height;
        globalThis.APPNamespace.width = width;

        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.position.z = height;
            this.camera.far = height + 500;
            this.camera.lookAt(0, 0, 0);
            this.camera.updateProjectionMatrix();
        }

        if (this.renderer) {
            this.renderer.setSize(width, height)
            this.renderer.render(this.scene, this.camera);
        }

        this.objects.forEach((obj) => {
            if (obj instanceof Drum) {
                obj.refresh_position();
            }
            if (obj instanceof Interface) {
                obj.resize();
            }
        });
    }

    append3DObject(obj3D: Object3D, renderOrder = null) {
        if (renderOrder != null)
            obj3D.obj.renderOrder = renderOrder;
        else
            obj3D.obj.renderOrder = this.#renderOrder++;
        this.scene.add(obj3D.obj);
        this.objects.push(obj3D);
    }

    prepend3DObject(obj3D: Object3D, renderOrder = null) {
        if (renderOrder != null)
            obj3D.obj.renderOrder = renderOrder;
        else
            obj3D.obj.renderOrder = this.#renderOrder++;
        this.scene.add(obj3D.obj);
        this.objects.unshift(...[obj3D]);
    }

    removeByName(name: string) {
        const obj3D = this.objects.find((obj) => obj.obj.name == name);
        if (obj3D) {
            if (obj3D instanceof Microphone)
                obj3D.play_sound(null);
            obj3D.obj.removeFromParent();
            this.objects = this.objects.filter(function (obj) {
                return obj.obj.name != name;
            });
        }
        this.render();
        return obj3D;
    }

    addControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 1, 0);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }


    render() {
        this.renderer.render(this.scene, this.camera)
    }

}