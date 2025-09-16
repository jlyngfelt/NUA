import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Hoodie() {
  const mountRef = useRef(null);
  const rootRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const [activeView, setActiveView] = useState("front");

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 774 / 700, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(774, 700);
    renderer.setClearColor(0xc4c4c4, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Add multiple lights for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/nua-hoodie-first-test/test-4.gltf",
      (gltf) => {
        console.log("Model loaded successfully");
        rootRef.current = gltf.scene;
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
    <div style={{ position: "relative", width: "774px", height: "700px" }}>
      <div ref={mountRef} />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            position: "relative",
          }}
        >
          {buttons.map((button) => (
            <button
              key={button.key}
              onClick={() => setCameraView(button.key)}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Indicator line */}
        <div
          style={{
            position: "relative",
            height: "2px",
            backgroundColor: "lightgray",
            marginTop: "8px",
            borderRadius: "1px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${(getActivePosition() * 100) / buttons.length}%`,
              width: `${100 / buttons.length}%`,
              height: "100%",
              backgroundColor: "black",
              borderRadius: "1px",
              transition: "left 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
