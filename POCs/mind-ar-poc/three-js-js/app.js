import 'mind-ar/dist/mindar-face-three.prod';

/*eslint no-undef: 0*/
const THREE = window.MINDAR.FACE.THREE;
const mindarThree = new window.MINDAR.FACE.MindARThree({
    container: document.querySelector("#container"),
});

var link = require('../assets/canonical_face_model_uv_visualization.png')

const { renderer, scene, camera } = mindarThree;
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);
const faceMesh = mindarThree.addFaceMesh();
const texture = new THREE.TextureLoader().load(link);
faceMesh.material.map = texture;
faceMesh.material.transparent = true;
faceMesh.material.needsUpdate = true;
scene.add(faceMesh);
const start = async () => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
start();