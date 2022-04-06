declare function require(name:string);

import * as THREE from 'three'
import oc from 'three-orbit-controls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
const OrbitControls = oc(THREE);

const scene = new THREE.Scene();
scene.background =  new THREE.Color( 0x33CEA4 );
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.PointLight()
light1.position.set(0.8, 1.4, 30)
scene.add(light1)

// const ambientLight = new THREE.AmbientLight(0x404040, 1.0)
// scene.add(ambientLight)

const light = new THREE.HemisphereLight(0xFFFF80, 0x4040FF, 1.0);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 25)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

//const material = new THREE.MeshNormalMaterial()

const loader = new FBXLoader();
loader.load(
    require('../static/models/mic/uploads_files_3171311_Microphone_FBX.fbx'),
    async (object) => {
        object.position.y = -8;
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()