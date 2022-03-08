import * as THREE from 'three';
import poseDetector from "./ia.js"


function change_position2d(cube, keypoint, width, height) {
    if (keypoint && keypoint.score > 0.85) {
        cube.visible = true;
        cube.position.x = (keypoint.x - width / 2);
        cube.position.y = - (keypoint.y - height / 2);
    }
    else
        cube.visible = false
}

function add_mesh_body(scene, mesh, width, height) {
    mesh.forEach(keypoint => {
        if (keypoint.score > 0.85) {
            var obj = scene.getObjectByName(keypoint.name);
            if (!obj) {
                var material = null;
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

    var width = video.videoWidth;
    var height = video.videoHeight;


    const scene = new THREE.Scene();
    scene.background = new THREE.VideoTexture(video);
    const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    document.querySelector('canvas').style = '-moz-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); transform: scale(-1, 1); filter: FlipH;';

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


    camera.position.z = width;
    async function animate() {
        requestAnimationFrame(animate);

        green_cube.rotation.x += 0.01;
        green_cube.rotation.y += 0.01;
        red_cube.rotation.x += 0.02;
        red_cube.rotation.y += 0.01;

        var mesh = await pose_detector.predictFrameKeypoints2d();
        if (mesh != null) {
            add_mesh_body(scene, mesh, width, height);
            var left_keypoint = mesh.find(keypoint => keypoint.name == "left_wrist");
            change_position2d(green_cube, left_keypoint, width, height);
            var right_keypoint = mesh.find(keypoint => keypoint.name == "right_wrist");
            change_position2d(red_cube, right_keypoint, width, height);

        }
        else {
            green_cube.visible = false;
            red_cube.visible = false;
        }

        renderer.render(scene, camera);
    }

    return animate;
}