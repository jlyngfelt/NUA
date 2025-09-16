import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styles from "./Hoodie.module.css";

export const Hoodie = () => {
  const mountRef = useRef(null);
  const rootRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const [activeView, setActiveView] = useState("front");

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 774 / 700, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    renderer.setSize(774, 700);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xc4c4c4, 1);

    // Enhanced quality settings
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Studio-quality lighting setup for optimal hoodie presentation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key light - main directional light positioned like studio photography
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(8, 12, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill light - softer light from the opposite side to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-6, 8, 4);
    scene.add(fillLight);

    // Back light for rim lighting effect
    const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backLight.position.set(0, 6, -12);
    scene.add(backLight);

    // Side accent light for texture definition
    const sideLight = new THREE.SpotLight(0xffffff, 0.6, 30, Math.PI * 0.15, 0.3);
    sideLight.position.set(12, 8, 2);
    scene.add(sideLight);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/nua hoodie green test/nua hoodie green test.gltf",
      (gltf) => {
        console.log("Model loaded successfully");
        rootRef.current = gltf.scene;

        // Enable shadows on the model
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Enhance material properties
            if (child.material) {
              child.material.envMapIntensity = 1.0;
              if (child.material.roughness !== undefined) {
                child.material.roughness = Math.max(0.1, child.material.roughness);
              }
            }
          }
        });

        scene.add(rootRef.current);

        // Get bounding box to position camera properly
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        gltf.scene.position.copy(center.multiplyScalar(-1));
        camera.position.set(0, 0, size * 0.7);
        camera.lookAt(0, 0, 0);

        // Add orbit controls for mouse interaction
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = false;
        controlsRef.current = controls;

        // Update controls in animation loop
        function animate() {
          controls.update();
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }
        animate();
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    return () => {
      if (
        mountRef.current &&
        renderer.domElement &&
        mountRef.current.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const setCameraView = (view) => {
    if (!cameraRef.current || !controlsRef.current) return;

    setActiveView(view);

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const distance = camera.position.length();

    let newPosition;
    switch (view) {
      case "front":
        newPosition = new THREE.Vector3(0, 0, distance);
        break;
      case "3/4-front":
        newPosition = new THREE.Vector3(distance * 0.7, 0, distance * 0.7);
        break;
      case "back":
        newPosition = new THREE.Vector3(0, 0, -distance);
        break;
      case "3/4-back":
        newPosition = new THREE.Vector3(-distance * 0.7, 0, -distance * 0.7);
        break;
      default:
        return;
    }

    camera.position.copy(newPosition);
    camera.lookAt(0, 0, 0);
    controls.update();
  };

  const handleZoom = (direction) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Use smaller increments for smoother zooming
    const zoomFactor = direction === 'in' ? 0.9 : 1.1;

    const currentDistance = camera.position.length();
    const newDistance = currentDistance * zoomFactor;

    // Set reasonable zoom limits based on the initial camera distance
    const minDistance = 2;
    const maxDistance = 100;

    if (newDistance < minDistance || newDistance > maxDistance) {
      return; // Don't zoom if we're at the limits
    }

    // Store the current direction and apply new distance
    const cameraDirection = camera.position.clone().normalize();
    camera.position.copy(cameraDirection.multiplyScalar(newDistance));

    controls.update();
  };

  const buttons = [
    { key: "front", label: "Front" },
    { key: "3/4-front", label: "3/4 Front" },
    { key: "back", label: "Back" },
    { key: "3/4-back", label: "3/4 Back" },
  ];

  const getActivePosition = () => {
    const activeIndex = buttons.findIndex((btn) => btn.key === activeView);
    return activeIndex !== -1 ? activeIndex : 0;
  };

  return (
    <div className={styles.container}>
      <div ref={mountRef} />

      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <div className={styles.zoomControl}>
          <button
            onClick={() => handleZoom('in')}
            className={styles.zoomButton}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_103_131" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" transform="matrix(-1 0 0 1 40 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_103_131)">
                <path d="M7 34.9717L17.8054 24.1663C18.6388 24.8699 19.606 25.4208 20.7071 25.8192C21.8082 26.2172 22.9799 26.4163 24.2221 26.4163C27.2343 26.4163 29.7837 25.3722 31.8704 23.2842C33.9568 21.1964 35 18.6664 35 15.6942C35 12.722 33.956 10.1918 31.8679 8.10376C29.7801 6.01571 27.2454 4.97168 24.2637 4.97168C21.2824 4.97168 18.7524 6.01571 16.6737 8.10376C14.5949 10.1918 13.5554 12.7233 13.5554 15.6983C13.5554 16.8992 13.7499 18.0506 14.1388 19.1525C14.5276 20.2542 15.0925 21.2681 15.8333 22.1942L5 32.9717L7 34.9717ZM24.25 23.6383C22.0508 23.6383 20.1817 22.8629 18.6425 21.3121C17.1031 19.7613 16.3333 17.8886 16.3333 15.6942C16.3333 13.4997 17.1031 11.627 18.6425 10.0758C20.1817 8.52501 22.0508 7.7496 24.25 7.7496C26.4644 7.7496 28.3468 8.52501 29.8971 10.0758C31.4471 11.627 32.2221 13.4997 32.2221 15.6942C32.2221 17.8886 31.4471 19.7613 29.8971 21.3121C28.3468 22.8629 26.4644 23.6383 24.25 23.6383ZM25.6667 20.4442V17.055H29.0554V14.2775H25.6667V10.9163H22.8887V14.2775H19.5279V17.055H22.8887V20.4442H25.6667Z" fill="#1C1B1F"/>
              </g>
            </svg>
          </button>
          <span className={styles.zoomLabel}>Zoom In</span>
        </div>

        <div className={styles.zoomControl}>
          <button
            onClick={() => handleZoom('out')}
            className={styles.zoomButton}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_103_132" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                <rect width="40" height="40" transform="matrix(-1 0 0 1 40 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_103_132)">
                <path d="M7 34.9717L17.8054 24.1663C18.6388 24.8699 19.606 25.4208 20.7071 25.8192C21.8082 26.2172 22.9799 26.4163 24.2221 26.4163C27.2343 26.4163 29.7837 25.3722 31.8704 23.2842C33.9568 21.1964 35 18.6664 35 15.6942C35 12.722 33.956 10.1918 31.8679 8.10376C29.7801 6.01571 27.2454 4.97168 24.2637 4.97168C21.2824 4.97168 18.7524 6.01571 16.6737 8.10376C14.5949 10.1918 13.5554 12.7233 13.5554 15.6983C13.5554 16.8992 13.7499 18.0506 14.1388 19.1525C14.5276 20.2542 15.0925 21.2681 15.8333 22.1942L5 32.9717L7 34.9717ZM24.25 23.6383C22.0508 23.6383 20.1817 22.8629 18.6425 21.3121C17.1031 19.7613 16.3333 17.8886 16.3333 15.6942C16.3333 13.4997 17.1031 11.627 18.6425 10.0758C20.1817 8.52501 22.0508 7.7496 24.25 7.7496C26.4644 7.7496 28.3468 8.52501 29.8971 10.0758C31.4471 11.627 32.2221 13.4997 32.2221 15.6942C32.2221 17.8886 31.4471 19.7613 29.8971 21.3121C28.3468 22.8629 26.4644 23.6383 24.25 23.6383ZM19.5279 17.055H29.0554V14.2775H19.5279V17.055Z" fill="#1C1B1F"/>
              </g>
            </svg>
          </button>
          <span className={styles.zoomLabel}>Zoom Out</span>
        </div>
      </div>

      <div className={styles.viewControls}>
        <div className={styles.viewButtons}>
          {buttons.map((button) => (
            <button
              key={button.key}
              onClick={() => setCameraView(button.key)}
              className={styles.viewButton}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Indicator line */}
        <div className={styles.indicatorContainer}>
          <div
            className={styles.indicatorLine}
            style={{
              left: `${(getActivePosition() * 100) / buttons.length}%`,
              width: `${100 / buttons.length}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
