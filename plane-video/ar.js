import * as THREE from 'three';
import poseDetector from "./ia.js"
import OneEuroFilter2D from './oneEuroFilter.js';

function change_position2d(obj, keypoint, width, height, filter) {
    if (keypoint && keypoint.score > 0.85) {
        obj.visible = true;
        x = (keypoint.x - width / 2);
        y = - (keypoint.y - height / 2);
        if (!filter)
            filter = new OneEuroFilter2D(x, y, Date.now(), 0.0, 0.004, 0.7, 1.0)
        else {
            estimation = filter.call(x, y)
            if (estimation) {
                x = estimation[0];
                y = estimation[1];
            }

        }
        obj.position.x = x;
        obj.position.y = y;
        return filter
    }
    else
        obj.visible = false;
    return null;
}

function add_mesh_body(scene, mesh, video) {
    const points = [];
    const width = video.videoWidth;
    const height = video.videoHeight;

    mesh.forEach(keypoint => {
        if (keypoint.score > 0.85) {
            obj = scene.getObjectByName(keypoint.name);
            if (!obj) {
                material = null;
                if (keypoint.name.includes("left")) {
                    material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                }
                else
                    material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
                const geometry = new THREE.CircleGeometry(5, 32);

                const circle = new THREE.Mesh(geometry, material);
                circle.name = keypoint.name
                scene.add(circle);
                obj = circle
            }
            // change_position2d(obj, keypoint, width, height, filter);
            obj.visible = true;
            obj.position.x = (keypoint.x - width / 2);
            obj.position.y = - (keypoint.y - height / 2);
        }
        else {
            obj = scene.getObjectByName(keypoint.name);
            if (obj)
                obj.visible = false;
        }
    });
}



export default async function createScene(video) {

    const width = video.videoWidth;
    const height = video.videoHeight;

    let redPosFilter = null;
    let greenPosFilter = null;
    let landmarkFilters = {};

    const scene = new THREE.Scene();
    scene.background = new THREE.VideoTexture(video);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 0);

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); transform: scale(-1, 1); filter: FlipH;';

    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;


    // const plane_geo = new THREE.PlaneGeometry(width, height);
    // const videoTexture = new THREE.VideoTexture(video);
    // videoTexture.flipX = false;
    // const video_material = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide} );
    // const plane = new THREE.Mesh(plane_geo, video_material);
    // plane.position.set(0, 0, 0)
    // scene.add(plane);



    const geometry = new THREE.BoxGeometry();
    const green = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const green_cube = new THREE.Mesh(geometry, green);
    green_cube.scale.set(10, 10, 10);
    green_cube.position.x = 2;
    green_cube.name = "leftHandCube"

    const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const red_cube = new THREE.Mesh(geometry, red);
    red_cube.scale.set(10, 10, 10);
    red_cube.position.x = -2;
    red_cube.name = "rightHandCube"

    camera.lookAt(0, 0, 0);

    const pose_detector = new poseDetector(video)
    await pose_detector.init()
    const gridHelper = new THREE.GridHelper(1000, 100, 0xff0000);
    const axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);
    scene.add(gridHelper);
    scene.add(green_cube);
    scene.add(red_cube);


    camera.position.z = height;

    counter = 0

    async function animate() {
        requestAnimationFrame(animate);
        green_cube.rotation.x += 0.01;
        green_cube.rotation.y += 0.01;
        red_cube.rotation.x += 0.02;
        red_cube.rotation.y += 0.01;
        mesh = await pose_detector.predictFrameKeypoints2d();
        if (mesh != null) {
            add_mesh_body(scene, mesh, video)

            left_keypoint = mesh.find(keypoint => keypoint.name == "left_wrist")
            greenPosFilter = change_position2d(green_cube, left_keypoint, width, height, greenPosFilter)
            right_keypoint = mesh.find(keypoint => keypoint.name == "right_wrist")
            redPosFilter = change_position2d(red_cube, right_keypoint, width, height, redPosFilter)

        }
        else {
            green_cube.visible = false;
            red_cube.visible = false;
        }
        // controls.update();
        // console.log(camera.position)
        renderer.render(scene, camera);
    };

    return animate
}