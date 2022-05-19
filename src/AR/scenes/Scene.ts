import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Drum from '../objects/Instruments/Drum';
import Microphone from '../objects/Instruments/Microphone';
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

        const coordinates = this.get_canvas_size();
        const width = coordinates["width"];
        const height = coordinates["height"];

        this.scene = new THREE.Scene();
        const texture = new THREE.VideoTexture(this.video);
        this.scene.background = texture;

        this.resize_background(width, height);

        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, height + 500);
        this.resize_camera(width, height);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(light);

        const light1 = new THREE.PointLight();
        light1.position.set(0.8, 1.4, height + 5);
        this.scene.add(light1);

        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild(this.renderer.domElement);
        document.querySelector('canvas').setAttribute("id", "scene");
        document.getElementById("scene").style.display = "none";
        this.resize_renderer(width, height);

        if (debug) {
            this.addControls();
            this.addGridHelper();
        }
        this.initialisation = true;
    }

    get_canvas_size() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        const min = 150;

        if (width < min || height < min) {
            height = this.video.videoHeight;
            width = this.video.videoWidth;
        }

        return { "width": width, "height": height };
    }

    resize_background(width, height) {
        this.scene.background.matrixAutoUpdate = false;
        const aspect = width / height;
        var imageAspect = this.video.videoWidth / this.video.videoHeight;

        globalThis.APPNamespace.height = height;
        globalThis.APPNamespace.width = width;

        if (aspect < imageAspect) {
            this.scene.background.matrix.setUvTransform(0, 0, -aspect / imageAspect, 1, 0, 0.5, 0.5);
            globalThis.APPNamespace.width = height / this.video.videoHeight * this.video.videoWidth;

        } else {
            this.scene.background.matrix.setUvTransform(0, 0, -1, imageAspect / aspect, 0, 0.5, 0.5);
            globalThis.APPNamespace.height = width / this.video.videoWidth * this.video.videoHeight;
        }
    }

    resize_camera(width, height) {
        this.camera.aspect = width / height;
        this.camera.position.z = height;
        this.camera.far = height + 500;
        this.camera.lookAt(0, 0, 0);
        this.camera.updateProjectionMatrix();
    }

    resize_renderer(width, height) {
        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const coordinates = this.get_canvas_size();
        const width = coordinates["width"];
        const height = coordinates["height"];

        if (this.scene && this.scene.background) {
            this.resize_background(width, height);
        }

        if (this.camera) {
            this.resize_camera(width, height);
        }

        if (this.renderer) {
            this.resize_renderer(width, height);
        }

        this.objects.forEach((obj) => {
            if (obj instanceof Drum) {
                obj.refresh_position();
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