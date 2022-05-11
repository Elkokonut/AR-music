import * as THREE from 'three';

export default function ImageTexture(path, onResult) {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
        console.log(texture);
        onResult(texture);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    });
}