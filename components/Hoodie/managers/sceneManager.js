import * as THREE from "three";

export class SceneManager {
  constructor(mountRef) {
    this.mountRef = mountRef;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  initializeScene() {
    if (!this.mountRef.current) return null;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, 774 / 700, 0.1, 1000);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setSize(774, 700);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0xc4c4c4, 1);

    // Enhanced quality settings for better texture rendering
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2; // Balanced exposure for good texture visibility

    this.mountRef.current.appendChild(this.renderer.domElement);

    // Setup lighting
    this.setupLighting();

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  setupLighting() {
    // Studio-quality lighting setup for optimal hoodie presentation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Key light - main directional light positioned like studio photography
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(8, 12, 6);
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Fill light - softer light from the opposite side to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-6, 8, 4);
    this.scene.add(fillLight);

    // Back light for rim lighting effect
    const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backLight.position.set(0, 6, -12);
    this.scene.add(backLight);

    // Side accent light for texture definition
    const sideLight = new THREE.SpotLight(
      0xffffff,
      0.6,
      30,
      Math.PI * 0.15,
      0.3
    );
    sideLight.position.set(12, 8, 2);
    this.scene.add(sideLight);
  }

  addModelToScene(model) {
    if (this.scene && model) {
      this.scene.add(model);
    }
  }

  dispose() {
    if (
      this.mountRef.current &&
      this.renderer &&
      this.renderer.domElement &&
      this.mountRef.current.contains(this.renderer.domElement)
    ) {
      this.mountRef.current.removeChild(this.renderer.domElement);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}