import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorwayTextures } from '../config/colorConfig';

export const useHoodieModel = (mountRef, customColors) => {
  const rootRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const preloadedTexturesRef = useRef({});

  const preloadTextures = () => {
    const textureLoader = new THREE.TextureLoader();

    Object.keys(colorwayTextures).forEach(colorway => {
      preloadedTexturesRef.current[colorway] = {};
      const textures = colorwayTextures[colorway];

      // Preload diffuse texture
      preloadedTexturesRef.current[colorway].diffuse = textureLoader.load(textures.diffuse);
      // Preload normal texture
      preloadedTexturesRef.current[colorway].normal = textureLoader.load(textures.normal);
      // Preload metallic/roughness texture
      preloadedTexturesRef.current[colorway].metallicRoughness = textureLoader.load(textures.metallicRoughness);
    });
  };

  const applyCustomColors = () => {
    if (!rootRef.current) return;

    console.log('Applying custom colors:', customColors);

    // Find and update material textures
    rootRef.current.traverse((child) => {
      if (child.isMesh && child.material && child.name) {
        // Determine which part this mesh belongs to
        let partType = null;

        // More specific matching based on actual mesh names we found
        if (child.name.includes('Zipper') || child.name.includes('ZipperPattern')) {
          partType = 'zipperDetails';
        } else if (child.name.includes('Body') || child.name.includes('Sleeves') ||
            child.name.includes('Hood_outside') || child.name.includes('Cuff')) {
          partType = 'body';
        } else if (child.name.includes('Hood_inside') || child.name.includes('Lining') ||
                   child.name.includes('Trim') || child.name.includes('Stopper') ||
                   child.name.includes('Piping') || child.name.includes('Strap')) {
          partType = 'hoodInterior';
        }

        if (partType && customColors[partType]) {
          // Clone the material to avoid affecting other meshes
          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;

            // Store original texture if it exists
            if (child.material.map) {
              child.material.userData.originalMap = child.material.map.clone();
            }
          }

          // Apply the custom color
          const color = new THREE.Color(customColors[partType]);

          // Handle different material types appropriately
          if (partType === 'zipperDetails') {
            // Zipper/metallic components should always use pure color (no texture)
            child.material.map = null;
            child.material.color = color;
            child.material.metalness = 0.8; // More metallic for zipper parts
            child.material.roughness = 0.2; // Smoother for metal/plastic
          } else if (partType === 'body') {
            // For main fabric, always use pure colors to avoid texture color interference
            child.material.map = null;
            child.material.color = color;
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
          } else if (child.material.userData.originalMap) {
            // For other fabric parts (hood interior), handle light vs dark colors differently
            const colorLuminance = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;

            if (colorLuminance > 0.7) { // Light colors (white, light gray, etc.)
              child.material.map = null;
              child.material.color = color;
              child.material.metalness = 0.1;
              child.material.roughness = 0.8;
            } else { // Darker colors can use texture tinting
              child.material.map = child.material.userData.originalMap;
              child.material.color = color;
            }
          } else {
            // For materials without textures, just set the color
            child.material.color = color;
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
          }

          child.material.needsUpdate = true;
        }
      }
    });
  };

  const setCameraView = (view) => {
    if (!cameraRef.current || !controlsRef.current) return;

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

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Preload all textures first
    preloadTextures();

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

    // Load the hoodie model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway.gltf",
      (gltf) => {
        rootRef.current = gltf.scene;

        // Enable shadows on the model
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
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

        // Apply initial custom colors
        applyCustomColors();
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

  // Handle custom color changes
  useEffect(() => {
    if (rootRef.current) {
      applyCustomColors();
    }
  }, [customColors]);

  return {
    setCameraView,
    handleZoom
  };
};