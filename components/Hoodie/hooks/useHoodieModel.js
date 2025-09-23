import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  getTexturePaths,
  defaultMaterialSelections,
} from "../config/materialConfig";
import { partMapping } from "../config/colorConfig";

const getMeshPartType = (meshName) => {
  // Check each part category to see if this mesh belongs to it
  for (const [partType, meshNames] of Object.entries(partMapping)) {
    if (meshNames.includes(meshName)) {
      return {
        partType,
        materialPartId:
          partType === "zipperDetails"
            ? null
            : partType === "hoodInterior"
            ? "lining"
            : "main",
      };
    }
  }

  // Fallback: if mesh name not found in mapping, try pattern matching
  if (meshName.includes("Hood_inside")) {
    return { partType: "hoodInterior", materialPartId: "lining" };
  } else if (
    meshName.includes("Zipper") ||
    meshName.includes("Stopper") ||
    meshName.includes("Trim") ||
    meshName.includes("Piping") ||
    meshName.includes("Strap") ||
    meshName.includes("String") ||
    meshName.includes("string") ||
    meshName.includes("Cord") ||
    meshName.includes("cord") ||
    meshName.includes("Topstitch") ||
    meshName.includes("Binding")
  ) {
    return { partType: "zipperDetails", materialPartId: null };
  } else {
    // Default to body/main material
    return { partType: "body", materialPartId: "main" };
  }
};

export const useHoodieModel = (
  mountRef,
  customColors,
  materialSelections = defaultMaterialSelections
) => {
  const rootRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const preloadedTexturesRef = useRef({});
  const materialTexturesRef = useRef({});
  const initialDistanceRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);

  const preloadMaterialTextures = (renderer) => {
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer
      ? renderer.capabilities.getMaxAnisotropy()
      : 16;

    // Preload ALL possible material combinations, not just current selections
    const allMaterials = ["cotton", "teddy", "nylon"];
    const allParts = ["main", "lining"];

    allMaterials.forEach((materialId) => {
      allParts.forEach((partId) => {
        const texturePaths = getTexturePaths(materialId, partId);
        if (texturePaths) {
          const key = `${materialId}_${partId}`;
          materialTexturesRef.current[key] = {
            diffuse: textureLoader.load(
              texturePaths.diffuse,
              (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.flipY = false;
                // Enhanced texture settings for better visibility
                texture.repeat.set(1, 1); // Use original UV mapping
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.anisotropy = maxAnisotropy; // Maximum anisotropic filtering for crisp textures
              }
            ),
            normal: textureLoader.load(
              texturePaths.normal,
              (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.flipY = false;
                // Enhanced texture settings for better visibility
                texture.repeat.set(1, 1); // Use original UV mapping to prevent distortion
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.anisotropy = maxAnisotropy;
              }
            ),
            metallicRoughness: textureLoader.load(
              texturePaths.metallicRoughness,
              (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.flipY = false;
                // Enhanced texture settings for better visibility
                texture.repeat.set(1, 1); // Use original UV mapping to prevent distortion
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.anisotropy = maxAnisotropy;
              }
            ),
          };
        }
      });
    });
  };

  const applyMaterialsAndColors = () => {
    if (!rootRef.current) return;

    // Apply materials and colors to the model
    rootRef.current.traverse((child) => {
      if (child.isMesh && child.material && child.name) {
        // Get part type and material ID using the mapping
        const { partType, materialPartId } = getMeshPartType(child.name);

        // Handle material application based on part type
        if (partType === "zipperDetails") {
          // Check if this is a string/strap (should be fabric, not metallic)
          const isString =
            child.name.includes("Strap") ||
            child.name.includes("String") ||
            child.name.includes("string") ||
            child.name.includes("Cord") ||
            child.name.includes("cord");

          // Check if this is piping (should be plastic, not metallic)
          const isPiping =
            child.name.includes("Piping") || child.name.includes("Binding");

          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;
            child.material.userData.originalColor =
              child.material.color.clone();
          }

          // Remove any textures and apply properties based on material type
          child.material.map = null;
          child.material.normalMap = null;
          child.material.metalnessMap = null;
          child.material.roughnessMap = null;

          // Apply custom color if specified, otherwise use default color
          if (customColors[partType]) {
            const color = new THREE.Color(customColors[partType]);
            child.material.color = color;
          } else {
            // Default color based on type
            if (isString) {
              child.material.color.setHex(0x2c2c2c); // Dark grey for strings
            } else if (isPiping) {
              child.material.color.setHex(0x3a3a3a); // Slightly lighter grey for piping
            } else {
              child.material.color.setHex(0x404040); // Darker metallic silver for hardware
            }
          }

          // Apply different material properties for strings vs piping vs hardware
          if (isString) {
            // Fabric properties for strings/straps
            child.material.metalness = 0.0; // No metalness - fabric
            child.material.roughness = 0.9; // High roughness - fabric/cord texture
          } else if (isPiping) {
            // Plastic properties for piping/binding
            child.material.metalness = 0.1; // Very low metalness - plastic
            child.material.roughness = 0.6; // Medium roughness - plastic texture
          } else {
            // Metallic properties for zippers, stoppers, etc.
            child.material.metalness = 0.7;
            child.material.roughness = 0.2;
          }

          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.visible = true;
          child.visible = true;
          child.material.needsUpdate = true;
        } else if (partType && materialPartId) {
          // Clone the material to avoid affecting other meshes
          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;

            // Store original properties
            if (child.material.map) {
              child.material.userData.originalMap = child.material.map.clone();
            }
            child.material.userData.originalColor =
              child.material.color.clone();
            child.material.userData.originalMetalness =
              child.material.metalness;
            child.material.userData.originalRoughness =
              child.material.roughness;
            if (child.material.emissive) {
              child.material.userData.originalEmissive =
                child.material.emissive.clone();
            }
          }

          // Clear any existing textures to prevent stacking
          if (child.material.map) {
            child.material.map = null;
          }
          if (child.material.normalMap) {
            child.material.normalMap = null;
          }
          if (child.material.metalnessMap) {
            child.material.metalnessMap = null;
          }
          if (child.material.roughnessMap) {
            child.material.roughnessMap = null;
          }

          // Get the selected material for this part
          const selectedMaterial = materialSelections[materialPartId];
          const materialKey = `${selectedMaterial}_${materialPartId}`;
          let materialTextures = materialTexturesRef.current[materialKey];

          // Fallback for lining material if 999 textures don't exist
          if (!materialTextures && materialPartId === "lining") {
            const fallbackKey = `${selectedMaterial}_main`;
            materialTextures = materialTexturesRef.current[fallbackKey];
          }

          // Apply material textures if available
          if (materialTextures && materialTextures.diffuse) {
            // Apply textures
            child.material.map = materialTextures.diffuse;
            child.material.normalMap = materialTextures.normal;
            // Don't use metallic maps for fabric materials to prevent dark spots
            child.material.metalnessMap = null;
            child.material.roughnessMap = materialTextures.metallicRoughness;

            // Add displacement mapping for physical texture depth
            child.material.displacementMap = materialTextures.normal; // Use normal map as displacement
            child.material.displacementScale = 0.05; // Increased displacement for more visible bump effect
            child.material.displacementBias = -0.025; // Center the displacement

            // Enhanced material properties for better texture visibility
            child.material.metalness = 0.0; // No metalness for fabric materials
            child.material.roughness = 0.8; // Appropriate roughness for fabric
            child.material.normalScale = new THREE.Vector2(2.5, 2.5); // Increased normal map intensity for more depth

            // Enhanced color handling for better texture visibility
            if (!customColors[partType]) {
              // Use white to show textures clearly
              child.material.color.setHex(0xffffff);
            } else {
              // Apply custom color with stronger tint while preserving texture detail
              const customColor = new THREE.Color(customColors[partType]);
              // Increased tint strength for more visible color changes
              const tintStrength = 0.99; // Stronger tint for better color visibility
              const white = new THREE.Color(0xffffff);
              child.material.color = white.lerp(customColor, tintStrength);
            }
          } else {
            // Fallback to default material properties when no textures are available
            if (partType === "zipperDetails") {
              child.material.metalness = 0.9;
              child.material.roughness = 0.2;
            } else {
              child.material.metalness = 0.1;
              child.material.roughness = 0.8;
            }

            // Restore original color or apply custom color
            if (customColors[partType]) {
              const color = new THREE.Color(customColors[partType]);
              child.material.color = color;
            } else if (child.material.userData.originalColor) {
              child.material.color = child.material.userData.originalColor;
            }
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
    const defaultDistance = initialDistanceRef.current || 10;

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
  };

  const handleZoom = (direction) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

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
  };

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, 774 / 700, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;

    renderer.setSize(774, 700);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xc4c4c4, 1);

    // Enhanced quality settings for better texture rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Balanced exposure for good texture visibility


    // Preload material textures with renderer anisotropy support
    preloadMaterialTextures(renderer);

    mountRef.current.appendChild(renderer.domElement);

    // Studio-quality lighting setup for optimal hoodie presentation
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key light - main directional light positioned like studio photography
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
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
    const sideLight = new THREE.SpotLight(
      0xffffff,
      0.6,
      30,
      Math.PI * 0.15,
      0.3
    );
    sideLight.position.set(12, 8, 2);
    scene.add(sideLight);

    // Add orbit controls for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 40;
    controls.maxDistance = 100;
    controls.enablePan = false;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // Update controls in animation loop
    let animationId;
    let needsRender = true;

    controls.addEventListener('change', () => {
      needsRender = true;
    });

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (controls.update() || needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }
    }
    animate();

    // Load the hoodie model
    // Create a custom loading manager that handles missing textures
    const loadingManager = new THREE.LoadingManager();

    // Set a custom loader for PNG files that skips missing textures
    loadingManager.setURLModifier((url) => {
      // Skip textures that don't exist
      if (url.includes("_999.png") || url.includes("_981.png")) {
        // Return a data URL for a 1x1 transparent pixel
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      }
      return url;
    });

    const gltfLoader = new GLTFLoader(loadingManager);

    gltfLoader.load(
      "/hoodie-materials/cotton.gltf",
      (gltf) => {
        rootRef.current = gltf.scene;

        // Enable shadows on the model and check geometry detail
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
        const initialDistance = size * 0.7;
        initialDistanceRef.current = initialDistance;
        camera.position.set(0, 0, initialDistance);
        camera.lookAt(0, 0, 0);

        // Apply initial materials and colors
        applyMaterialsAndColors();
      }
    );

    return () => {
      cancelAnimationFrame(animationId);

      if (rootRef.current) {
        rootRef.current.traverse((child) => {
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

      Object.values(materialTexturesRef.current).forEach(textures => {
        if (textures.diffuse) textures.diffuse.dispose();
        if (textures.normal) textures.normal.dispose();
        if (textures.metallicRoughness) textures.metallicRoughness.dispose();
      });

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

  // Handle custom color and material changes
  useEffect(() => {
    if (rootRef.current) {
      applyMaterialsAndColors();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
  }, [customColors, materialSelections]);

  // Preload material textures when selections change
  useEffect(() => {
    // Only preload if we have access to renderer capabilities
    if (mountRef.current && mountRef.current.querySelector("canvas")) {
      const canvas = mountRef.current.querySelector("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (gl) {
        preloadMaterialTextures({
          capabilities: {
            getMaxAnisotropy: () =>
              gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 16,
          },
        });
      }
    }
  }, [materialSelections]);

  return {
    setCameraView,
    handleZoom,
  };
};
