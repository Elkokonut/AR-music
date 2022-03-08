import * as THREE from 'three';
import poseDetector from "./ia.js"
import OneEuroFilter2D from './oneEuroFilter.js';


class Object3D {
    constructor(obj, name, scene, position, scale) {
        this.scene = scene;
        this.obj = obj;
        this.obj.name = name;
        this.type = "object3D";
        if (position)
            this.obj.position.set(position[0], position[1], position[2]);
        if (scale)
            this.obj.scale.set(scale[0], scale[1], scale[2]);
        scene.add(this.obj);
    }
}


class BodyTrackerObject extends Object3D {
    constructor(obj, name, scene, position, scale, keypoint_name) {
        super(obj, name, scene, position, scale);
        this.obj.visible = false;
        this.keypoint_name = keypoint_name;
        this.euroFilter = null;
        this.type = "BodyTrackerObject";
    }

    animate(mesh, width, height) {
        if (mesh != null) {
            console.log(this.type)
            this.change_position2d(mesh, width, height);
        }
        else {
            this.obj.visible = false;
        }
    }

    change_position2d(mesh, width, height) {
        var keypoint = mesh.find(keypoint => keypoint.name == this.keypoint_name)
        if (keypoint && keypoint.score > 0.90) {
            console.log(this.obj.scale)
            this.obj.visible = true;
            var x = (keypoint.x - width / 2);
            var y = - (keypoint.y - height / 2);
            if (this.type == "cube") {
                if (!this.euroFilter)
                    this.euroFilter = new OneEuroFilter2D(x, y, Date.now(), 0.0, 0.004, 0.7, 1.0)
                else {
                    var estimation = this.euroFilter.call(x, y)
                    if (estimation) {
                        x = estimation[0];
                        y = estimation[1];
                    }
                }
            }
            this.obj.position.x = x;
            this.obj.position.y = y;
        }
        else
            this.obj.visible = false;
        return null;

    }
}


class Cube extends BodyTrackerObject {
    constructor(name, scale, color, keypoint_name, scene) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        super(cube, name, scene, null, scale, keypoint_name);
        this.cube = cube;
        this.type = "cube";
    }
    animate(mesh, width, height) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        super.animate(mesh, width, height)
    }
}

class Disk extends BodyTrackerObject {
    constructor(name, color, scene) {
        const material = new THREE.MeshBasicMaterial({ color: color });
        const geometry = new THREE.CircleGeometry(5, 32);
        var circle = new THREE.Mesh(geometry, material);
        super(circle, name, scene, null, null, name);
        this.circle = circle;
        this.type = "Disk";
    }
    animate(mesh, width, height) {
        super.animate(mesh, width, height)
    }
}


class Scene {
    constructor(video) {
        this.video = video;
        this.width = 0;
        this.height = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.objects = []
    }

    init(width = null, height = null) {
        console.log("Init Scene");
        this.width = width ? width : this.video.videoWidth;
        this.height = height ? height : this.video.videoHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.VideoTexture(this.video);
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 0);
        this.camera.position.z = this.height;

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);
        document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); transform: scale(-1, 1); filter: FlipH;';


        this.camera.lookAt(0, 0, 0);

        this.addGridHelper()
    }


    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }


    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

}



export default class BodyTrackerScene extends Scene {

    #keypoints_names = [
        "nose",
        "left_eye_inner",
        "left",
        "left_eye_outer",
        "right_eye_inner",
        "right_eye",
        "right_eye_outer",
        "left_ear",
        "right_ear",
        "mouth_left",
        "mouth_right",
        "left_shoulder",
        "right_shoulder",
        "left_elbow",
        "right_elbow",
        "left_wrist",
        "right_wrist",
        "left_pinky",
        "right_pinky",
        "left_index",
        "right_index",
        "left_thumb",
        "right_thumb",
        "left_hip",
        "right_hip",
        "left_knee",
        "right_knee",
        "left_ankle",
        "right_ankle",
        "left_heel",
        "right_heel",
        "left_foot_index",
        "right_foot_index"
    ]

    constructor(video) {
        super(video);
        this.pose_detector = new poseDetector(video)
    }

    async init(width = null, height = null) {
        super.init(width, height);
        await this.pose_detector.init()

        this.objects.push(new Cube("leftHandCube", [10, 10, 10], 0x00ff00, "left_wrist", this.scene));
        this.objects.push(new Cube("rightHandCube", [10, 10, 10], 0x0000ff, "right_wrist", this.scene));

        for (var index in this.#keypoints_names) {
            if (this.#keypoints_names[index].includes("left"))
                this.objects.push(new Disk(this.#keypoints_names[index], 0xffff00, this.scene));
            else
                this.objects.push(new Disk(this.#keypoints_names[index], 0xff00ff, this.scene));
        }
    }


    async animate() {

        var self = this;

        async function render() {
            requestAnimationFrame(render);
            var mesh = await self.pose_detector.predictFrameKeypoints2d();

            self.objects.forEach(obj => {
                obj.animate(mesh, self.width, self.height);
            });
            self.renderer.render(self.scene, self.camera);
        }

        await render();

    }
}