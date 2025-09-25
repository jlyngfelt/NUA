import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class ModelLoader {
  constructor() {
    this.loadingManager = null;
    this.gltfLoader = null;
    this.setupLoaders();
  }

  setupLoaders() {
    // Create a custom loading manager that handles missing textures
    this.loadingManager = new THREE.LoadingManager();

    // Set a custom loader for PNG files that skips missing textures
    this.loadingManager.setURLModifier((url) => {
      // Skip textures that don't exist
      if (url.includes("_999.png") || url.includes("_981.png")) {
        // Return a data URL for a 1x1 transparent pixel
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      }
      return url;
    });

    this.gltfLoader = new GLTFLoader(this.loadingManager);
  }

  loadModel(modelPath) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        modelPath,
        (gltf) => {
          // Enable shadows on the model and check geometry detail
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          resolve(gltf.scene);
        },
        (progress) => {
          // Optional: handle loading progress
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  positionModel(model, cameraManager) {
    // Get bounding box to position camera properly
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Position the model at the center
    model.position.copy(center.multiplyScalar(-1));

    // Update camera positioning
    const cameraInfo = cameraManager.updateCameraPosition(box);

    return {
      model,
      boundingBox: box,
      ...cameraInfo
    };
  }

  disposeModel(model) {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }
  }
}