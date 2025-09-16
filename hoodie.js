import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

  const gltfLoader = new GLTFLoader();
  const url = 'nua-hoodie-first-test/test-4.gltf';

 let root = null;

  gltfLoader.load(url, (gltf) => {
    root = gltf.scene;
    scene.add(root);

    gltf.scene.position.set(0,0,0)
    gltf.scene.scale.set(1,1,1)
  });


function animate() {
  renderer.render(scene, camera);
    root.rotation.x += 0.01;
  root.rotation.y += 0.002;
  root.rotation.z += 0.003;
}
renderer.setAnimationLoop(animate);

document.body.appendChild(renderer.domElement);

camera.position.z = 30;

