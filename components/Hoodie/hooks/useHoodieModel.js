import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { colorwayTextures } from '../config/colorConfig';
import { getTexturePaths, defaultMaterialSelections } from '../config/materialConfig';

export const useHoodieModel = (mountRef, customColors, materialSelections = defaultMaterialSelections) => {
  const rootRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const preloadedTexturesRef = useRef({});
  const materialTexturesRef = useRef({});

  const preloadTextures = () => {
    const textureLoader = new THREE.TextureLoader();

    // Preload old colorway textures (keep for backwards compatibility)
    Object.keys(colorwayTextures).forEach(colorway => {
      preloadedTexturesRef.current[colorway] = {};
      const textures = colorwayTextures[colorway];

      preloadedTexturesRef.current[colorway].diffuse = textureLoader.load(textures.diffuse);
      preloadedTexturesRef.current[colorway].normal = textureLoader.load(textures.normal);
      preloadedTexturesRef.current[colorway].metallicRoughness = textureLoader.load(textures.metallicRoughness);
    });
  };

  const preloadMaterialTextures = (renderer) => {
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16;

    // Preload ALL possible material combinations, not just current selections
    const allMaterials = ['cotton', 'teddy', 'nylon'];
    const allParts = ['main', 'lining'];

    allMaterials.forEach(materialId => {
      allParts.forEach(partId => {
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
              },
              undefined,
              (error) => console.error(`Failed to load diffuse texture: ${texturePaths.diffuse}`, error)
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
              },
              undefined,
              (error) => console.error(`Failed to load normal texture: ${texturePaths.normal}`, error)
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
              },
              undefined,
              (error) => console.error(`Failed to load metallic-roughness texture: ${texturePaths.metallicRoughness}`, error)
            )
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

        // Determine which part this mesh belongs to based on mesh name patterns
        let partType = null;
        let materialPartId = null;

        // Map mesh names to material parts (based on the new material model structure)
        if (child.name.includes('1001')) {
          materialPartId = 'main'; // Main body material
          partType = 'body';
        } else if (child.name.includes('999')) {
          materialPartId = 'lining'; // Lining material
          partType = 'hoodInterior';
        } else if (child.name.includes('981')) {
          // 981 parts are zipper/details - keep as metallic, no material texture
          materialPartId = null;
          partType = 'zipperDetails';
        }

        // Legacy fallback for older mesh naming - be more specific about hood interior
        if (!materialPartId && !partType) {
          if (child.name.includes('Zipper')) {
            partType = 'zipperDetails';
            materialPartId = null; // Keep zippers metallic
          } else if (child.name.includes('Hood_inside')) {
            // Only Hood_inside should use lining material
            partType = 'hoodInterior';
            materialPartId = 'lining';
          } else if (child.name.includes('Body') || child.name.includes('Sleeves') ||
              child.name.includes('Hood_outside') || child.name.includes('Cuff')) {
            partType = 'body';
            materialPartId = 'main';
          } else if (child.name.includes('Piping') || child.name.includes('Strap') ||
                     child.name.includes('String') || child.name.includes('string') ||
                     child.name.includes('Cord') || child.name.includes('cord') ||
                     child.name.includes('Binding')) {
            // These parts should follow zipper details color and be metallic
            partType = 'zipperDetails';
            materialPartId = null; // Don't apply material texture to these metallic parts
          } else if (child.name.includes('Lining') || child.name.includes('Trim')) {
            // These parts should follow hood interior color but not use material texture
            partType = 'hoodInterior';
            materialPartId = null; // Don't apply material texture to these small parts
          } else if (child.name.includes('Stopper')) {
            // Stopper should follow zipper details color (hardware component)
            partType = 'zipperDetails';
            materialPartId = null; // Don't apply material texture to hardware parts
          } else {
            // Default fallback - apply main material to any unrecognized mesh
            partType = 'body';
            materialPartId = 'main';
          }
        }


        // Handle material application based on part type
        if (partType === 'zipperDetails') {
          // Zipper parts: always metallic, no material textures
          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;
            child.material.userData.originalColor = child.material.color.clone();
          }

          // Remove any textures and apply metallic properties
          child.material.map = null;
          child.material.normalMap = null;
          child.material.metalnessMap = null;
          child.material.roughnessMap = null;

          // Apply custom color if specified, otherwise use default metallic color
          if (customColors[partType]) {
            const color = new THREE.Color(customColors[partType]);
            child.material.color = color;
          } else {
            // Default metallic zipper color - darker silver for better visibility
            child.material.color.setHex(0x404040); // Darker metallic silver
          }

          child.material.metalness = 0.9;
          child.material.roughness = 0.2;
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
            child.material.userData.originalColor = child.material.color.clone();
            child.material.userData.originalMetalness = child.material.metalness;
            child.material.userData.originalRoughness = child.material.roughness;
            if (child.material.emissive) {
              child.material.userData.originalEmissive = child.material.emissive.clone();
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
          if (!materialTextures && materialPartId === 'lining') {
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
            if (partType === 'zipperDetails') {
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

    // Enhanced quality settings for better texture rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Balanced exposure for good texture visibility

    // Enable maximum anisotropic filtering for crisp textures
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    console.log('Max anisotropy supported:', maxAnisotropy);

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
    // Create a custom loading manager that handles missing textures
    const loadingManager = new THREE.LoadingManager();

    // Set a custom loader for PNG files that skips missing textures
    loadingManager.setURLModifier((url) => {
      // Skip textures that don't exist
      if (url.includes('_999.png') || url.includes('_981.png')) {
        // Return a data URL for a 1x1 transparent pixel
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
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
        camera.position.set(0, 0, size * 0.7);
        camera.lookAt(0, 0, 0);

        // Apply initial materials and colors
        applyMaterialsAndColors();
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

  // Handle custom color and material changes
  useEffect(() => {
    if (rootRef.current) {
      applyMaterialsAndColors();
    }
  }, [customColors, materialSelections]);

  // Preload material textures when selections change
  useEffect(() => {
    // Only preload if we have access to renderer capabilities
    if (mountRef.current && mountRef.current.querySelector('canvas')) {
      const canvas = mountRef.current.querySelector('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        preloadMaterialTextures({ capabilities: { getMaxAnisotropy: () => gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 16 } });
      }
    }
  }, [materialSelections]);

  return {
    setCameraView,
    handleZoom
  };
};