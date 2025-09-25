import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class CameraManager {
  constructor(camera, renderer, scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.initialDistance = null;
    this.controls = null;
    this.keysPressed = new Set();
    this.animationId = null;

    this.setupControls();
    this.setupKeyboardHandlers();
  }

  setupControls() {
    // Add orbit controls for mouse interaction
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.minDistance = 40;
    this.controls.maxDistance = 100;
    this.controls.enablePan = false;
    this.controls.autoRotate = false;

    // Set up animation loop for controls
    let needsRender = true;

    this.controls.addEventListener('change', () => {
      needsRender = true;
    });

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      if (this.controls.update() || needsRender) {
        this.renderer.render(this.scene, this.camera);
        needsRender = false;
      }
    };
    animate();
  }

  setupKeyboardHandlers() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (!this.controls || !this.camera) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        if (!this.keysPressed.has(event.key)) {
          this.keysPressed.add(event.key);
          if (!this.keyboardAnimationId) {
            this.smoothRotate();
          }
        }
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.handleZoom('in');
        break;
      case '-':
        event.preventDefault();
        this.handleZoom('out');
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        this.keysPressed.delete(event.key);
        break;
    }
  }

  smoothRotate() {
    if (!this.controls || !this.camera) return;

    const controls = this.controls;
    const camera = this.camera;
    let needsRender = false;

    // Smaller increment for smoother movement
    const rotationSpeed = Math.PI / 80;

    if (this.keysPressed.has('ArrowLeft')) {
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position.clone().sub(controls.target));
      spherical.theta -= rotationSpeed;
      const newPosition = new THREE.Vector3();
      newPosition.setFromSpherical(spherical).add(controls.target);
      camera.position.copy(newPosition);
      camera.lookAt(controls.target);
      needsRender = true;
    }

    if (this.keysPressed.has('ArrowRight')) {
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position.clone().sub(controls.target));
      spherical.theta += rotationSpeed;
      const newPosition = new THREE.Vector3();
      newPosition.setFromSpherical(spherical).add(controls.target);
      camera.position.copy(newPosition);
      camera.lookAt(controls.target);
      needsRender = true;
    }

    if (this.keysPressed.has('ArrowUp')) {
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position.clone().sub(controls.target));
      spherical.phi = Math.max(0.1, spherical.phi - rotationSpeed);
      const newPosition = new THREE.Vector3();
      newPosition.setFromSpherical(spherical).add(controls.target);
      camera.position.copy(newPosition);
      camera.lookAt(controls.target);
      needsRender = true;
    }

    if (this.keysPressed.has('ArrowDown')) {
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position.clone().sub(controls.target));
      spherical.phi = Math.min(Math.PI - 0.1, spherical.phi + rotationSpeed);
      const newPosition = new THREE.Vector3();
      newPosition.setFromSpherical(spherical).add(controls.target);
      camera.position.copy(newPosition);
      camera.lookAt(controls.target);
      needsRender = true;
    }

    if (needsRender) {
      controls.update();
      if (this.renderer && this.scene) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    // Continue animation if keys are pressed
    if (this.keysPressed.size > 0) {
      this.keyboardAnimationId = requestAnimationFrame(() => this.smoothRotate());
    } else {
      this.keyboardAnimationId = null;
    }
  }

  setCameraView(view) {
    if (!this.camera || !this.controls) return;

    const camera = this.camera;
    const controls = this.controls;
    const defaultDistance = this.initialDistance || 10;

    let newPosition;
    switch (view) {
      case "front":
        newPosition = new THREE.Vector3(0, 0, defaultDistance);
        break;
      case "3/4-front":
        newPosition = new THREE.Vector3(defaultDistance * 0.7, 0, defaultDistance * 0.7);
        break;
      case "back":
        newPosition = new THREE.Vector3(0, 0, -defaultDistance);
        break;
      case "3/4-back":
        newPosition = new THREE.Vector3(-defaultDistance * 0.7, 0, -defaultDistance * 0.7);
        break;
      default:
        return;
    }

    controls.target.set(0, 0, 0);
    camera.position.copy(newPosition);
    camera.lookAt(0, 0, 0);
    controls.update();
  }

  handleZoom(direction) {
    if (!this.camera || !this.controls) return;

    const camera = this.camera;
    const controls = this.controls;

    // Use smaller increments for smoother zooming
    const zoomFactor = direction === "in" ? 0.9 : 1.1;

    const currentDistance = camera.position.length();
    const newDistance = currentDistance * zoomFactor;

    // Set reasonable zoom limits based on the initial camera distance
    const minDistance = 10;
    const maxDistance = 100;

    if (newDistance < minDistance || newDistance > maxDistance) {
      return; // Don't zoom if we're at the limits
    }

    // Store the current direction and apply new distance
    const cameraDirection = camera.position.clone().normalize();
    camera.position.copy(cameraDirection.multiplyScalar(newDistance));

    controls.update();
  }

  setInitialDistance(distance) {
    this.initialDistance = distance;
  }

  updateCameraPosition(box) {
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Position the model at the center
    const initialDistance = size * 1;
    this.initialDistance = initialDistance;
    this.camera.position.set(0, 0, initialDistance);
    this.camera.lookAt(0, 0, 0);

    return { size, center, initialDistance };
  }

  dispose() {
    // Clean up keyboard event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    // Cancel animation frames
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.keyboardAnimationId) {
      cancelAnimationFrame(this.keyboardAnimationId);
    }

    // Dispose controls
    if (this.controls) {
      this.controls.dispose();
    }
  }
}