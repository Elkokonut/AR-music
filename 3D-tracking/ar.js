import * as THREE from 'three';
import poseDetector from "./ia.js"
import OneEuroFilterMD from './oneEuroFilter.js';
import { distance } from 'mathjs';
import oc from 'three-orbit-controls';

const OrbitControls = oc(THREE)

class Object3D {
    constructor(obj, name, scene, position, scale) {
        this.scene = scene;
        this.obj = obj;
        this.obj.name = name;

        this.z = 0;
        if (position)
            this.obj.position.set(position[0], position[1], position[2]);
        if (scale)
            this.obj.scale.set(scale[0], scale[1], scale[2]);
        scene.add(this.obj);
    }
}


class BodyTrackerObject extends Object3D {
    constructor(obj, name, type, scene, position, scale, keypoint_name) {
        super(obj, name, scene, position, scale);
        this.obj.visible = false;
        this.type = type;
        this.keypoint_name = keypoint_name;
        this.euroFilter = null;
    }

    animate(mesh, width, height) {
        if (mesh != null) {
            this.change_position2d(mesh, width, height);
        }
        else {
            this.obj.visible = false;
        }
    }

    get_position(keypoint, width, height) {
        var positions = [(keypoint.x - width / 2), - (keypoint.y - height / 2), keypoint.z / 10000];
        if (!this.euroFilter)
            this.euroFilter = new OneEuroFilterMD(positions, Date.now(), 0.001, 1.0);
        else {
            var estimation = this.euroFilter.call(positions);
            if (estimation) {
                return estimation;
            }
        }
        return positions;
    }

    change_position2d(mesh, width, height) {
        var keypoint = mesh.find(keypoint => keypoint.name == this.keypoint_name);
        if (keypoint && keypoint.score > 0.80) {
            this.obj.visible = true;
            var positions = this.get_position(keypoint, width, height);
            this.obj.position.x = positions[0];
            this.obj.position.y = positions[1];
            this.z = positions[2];
        }
        else
            this.obj.visible = false;
    }
}


class Cube extends BodyTrackerObject {
    constructor(name, type, scale, color, keypoint_name, scene) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        super(cube, name, type, scene, null, scale, keypoint_name);
        this.cube = cube;
        this.scale = scale;
    }
    animate(mesh, distance, width, height) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        super.animate(mesh, width, height)

        if (distance[this.type])
            this.obj.scale.x = this.scale[0] * (distance[this.type] + 1);
        this.obj.scale.y = this.scale[1] * (distance[this.type] + 1);
        this.obj.scale.z = this.scale[2] * (distance[this.type] + 1);
    }
}

class Disk extends BodyTrackerObject {
    constructor(name, type, color, scene) {
        const material = new THREE.MeshBasicMaterial({ color: color });
        const geometry = new THREE.CircleGeometry(5, 32);
        var circle = new THREE.Mesh(geometry, material);
        super(circle, name, type, scene, null, null, name);
        this.circle = circle;
    }
    animate(mesh, distance, width, height) {
        super.animate(mesh, width, height);
        if (distance[this.type])
            this.obj.scale.x = 2 * (distance[this.type] + 1);
        this.obj.scale.y = 2 * (distance[this.type] + 1);
        this.obj.scale.z = 2 * (distance[this.type] + 1);
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
        this.controls = null;

        this.initialisation = false;

        this.objects = []
    }

    init(width = null, height = null) {
        console.log("Init Scene");
        this.width = width ? width : this.video.videoWidth;
        this.height = height ? height : this.video.videoHeight;

        console.log(this.width + " ", this.height)

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.VideoTexture(this.video);
        // this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 0);
        this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, .1, 1000);
        this.camera.position.z = this.height;
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();

        var ratio = window.innerWidth / this.width;
        var renderheight = ratio * this.height;
        this.renderer.setSize(window.innerWidth, renderheight);
        document.body.appendChild(this.renderer.domElement);
        document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); \
                                                    -webkit-transform: scale(-1, 1); \
                                                    -o-transform: scale(-1, 1); \
                                                    transform: scale(-1, 1); \
                                                    filter: FlipH;\
                                                    width: 100%; \
                                                    max-width: 100%; \
                                                    height: 100%;';

        this.initialisation = true;
    }

    addControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    addGridHelper() {
        const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
        const axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }


    animate() {
        function render() {
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene, this.camera);
        }
        render();
    }

}



export default class BodyTrackerScene extends Scene {

    keypoints_infos = {
        "face": [
            [
                "nose",
                "left_eye_inner",
                "left",
                "right",
                "left_eye_outer",
                "right_eye_inner",
                "right_eye",
                "right_eye_outer",
                "left_ear",
                "right_ear",
                "mouth_left",
                "mouth_right"
            ],
            [
                "left_eye_outer",
                "right_eye_outer"
            ],
            0xffff00,
            {
                "min": "10",
                "max": "250"
            }
        ],
        "body": [
            [
                "left_shoulder",
                "right_shoulder",
                "left_elbow",
                "right_elbow",
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
            ],
            [
                "left_shoulder",
                "right_shoulder"
            ],
            0xff00ff,
            {
                "min": "10",
                "max": "400"
            }
        ],
        "right_hand": [
            [
                "right_wrist",
                "right_pinky",
                "right_index",
                "right_thumb"
            ],
            [
                "right_pinky",
                "right_thumb"
            ],
            0x00FFAC,
            {
                "min": "0",
                "max": "50"
            }
        ],
        "left_hand": [
            [
                "left_wrist",
                "left_pinky",
                "left_index",
                "left_thumb"
            ],
            [
                "left_pinky",
                "left_thumb"
            ],
            0x00F9FF,
            {
                "min": "0",
                "max": "50"
            }
        ]
    }

    constructor(video) {
        super(video);
        this.pose_detector = new poseDetector(video);
        this.distances = {};
    }

    async init(width = null, height = null) {
        super.init(width, height);
        await this.pose_detector.init();
        console.log(`Loaded model:${this.pose_detector.detectorConfig.modelType}`)

        this.objects.push(new Cube("leftHandCube", "left_hand", [20, 20, 20], 0x00ff00, "left_wrist", this.scene));
        this.objects.push(new Cube("rightHandCube", "right_hand", [20, 20, 20], 0x0000ff, "right_wrist", this.scene));

        for (const [type, keypoints_info] of Object.entries(this.keypoints_infos)) {
            this.distances[type] = 0;
            var keypoints_names = keypoints_info[0];
            var color = keypoints_info[2];
            for (var index in keypoints_names)
                this.objects.push(new Disk(keypoints_names[index], type, color, this.scene));
        }
    }

    editDistances(tmp_positions) {
        var out_min = -0.999999999;
        var out_max = 1;
        for (const [type, dist] of Object.entries(this.distances)) {
            if (tmp_positions[type] && tmp_positions[type].length == 2) {
                var in_min = this.keypoints_infos[type][3]["min"];
                var in_max = this.keypoints_infos[type][3]["max"];
                var tmp = distance(tmp_positions[type][0], tmp_positions[type][1]);
                tmp = Math.min(in_max, tmp);
                tmp = Math.max(in_min, tmp);
                tmp = (tmp - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
                this.distances[type] = tmp;
            }
        }
    }


    async animate() {

        var self = this;
        if (this.initialisation == false)
            this.init();
        var nb_calls_render = 0;
        setInterval(() => {
            document.getElementById("frameRateRender").innerHTML = 'Render FrameRate: ' + nb_calls_render;
            nb_calls_render = 0;
        }, 1000);

        async function render() {
            var mesh = await self.pose_detector.predictFrameKeypoints2d();
            nb_calls_render++;
            var distances = {};
            self.objects.forEach(obj => {
                obj.animate(mesh, self.distances, self.width, self.height);
                if (obj.obj.visible == true
                    && obj.constructor.name == "BodyTrackerObject"
                    || Object.getPrototypeOf(obj.constructor).name == "BodyTrackerObject") {
                    var infos = self.keypoints_infos[obj.type];
                    if (infos && infos[1] && infos[1].includes(obj.obj.name)) {
                        if (!distances[obj.type])
                            distances[obj.type] = [];
                        distances[obj.type].push([obj.obj.position.x, obj.obj.position.y, obj.z]);
                    }
                }
            });

            self.editDistances(distances);

            self.renderer.render(self.scene, self.camera);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}