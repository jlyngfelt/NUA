import { useEffect, useRef } from "react";
import { defaultMaterialSelections } from "../config/materialConfig";
import { SceneManager } from "../managers/sceneManager";
import { CameraManager } from "../managers/cameraManager";
import { TextureManager } from "../managers/textureManager";
import { MaterialApplicator } from "../managers/materialApplicator";
import { ModelLoader } from "../managers/modelLoader";

export const useHoodieModel = (
  mountRef,
  customColors,
  materialSelections = defaultMaterialSelections
) => {
  const rootRef = useRef(null);
  const sceneManagerRef = useRef(null);
  const cameraManagerRef = useRef(null);
  const textureManagerRef = useRef(null);
  const materialApplicatorRef = useRef(null);
  const modelLoaderRef = useRef(null);

  const applyMaterialsAndColors = () => {
    if (!rootRef.current || !materialApplicatorRef.current) return;
    materialApplicatorRef.current.applyMaterialsAndColors(rootRef.current, customColors, materialSelections);
  };

  const setCameraView = (view) => {
    if (cameraManagerRef.current) {
      cameraManagerRef.current.setCameraView(view);
    }
  };

  const handleZoom = (direction) => {
    if (cameraManagerRef.current) {
      cameraManagerRef.current.handleZoom(direction);
    }
  };

  // Keyboard controls are now handled by the CameraManager
  // No separate useEffect needed here as it's managed internally

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize all managers
    sceneManagerRef.current = new SceneManager(mountRef);
    textureManagerRef.current = new TextureManager();
    modelLoaderRef.current = new ModelLoader();

    // Initialize scene
    const { scene, camera, renderer } = sceneManagerRef.current.initializeScene();

    // Initialize camera manager
    cameraManagerRef.current = new CameraManager(camera, renderer, scene);

    // Initialize material applicator
    materialApplicatorRef.current = new MaterialApplicator(textureManagerRef.current);
    materialApplicatorRef.current.setRenderingContext(renderer, scene, camera);

    // Preload material textures
    textureManagerRef.current.preloadMaterialTextures(renderer);

    // Load the hoodie model
    modelLoaderRef.current.loadModel("/hoodie-materials/cotton.gltf")
      .then((model) => {
        rootRef.current = model;
        sceneManagerRef.current.addModelToScene(model);

        // Position the model and camera
        modelLoaderRef.current.positionModel(model, cameraManagerRef.current);

        // Apply initial materials and colors
        applyMaterialsAndColors();
      })
      .catch((error) => {
        console.error('Error loading model:', error);
      });

    return () => {
      // Cleanup all managers
      if (cameraManagerRef.current) {
        cameraManagerRef.current.dispose();
      }
      if (textureManagerRef.current) {
        textureManagerRef.current.dispose();
      }
      if (modelLoaderRef.current && rootRef.current) {
        modelLoaderRef.current.disposeModel(rootRef.current);
      }
      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
      }
    };
  }, []);

  // Handle custom color and material changes
  useEffect(() => {
    if (rootRef.current && materialApplicatorRef.current) {
      applyMaterialsAndColors();
    }
  }, [customColors, materialSelections]);

  // Preload material textures when selections change
  useEffect(() => {
    if (mountRef.current && mountRef.current.querySelector("canvas") && textureManagerRef.current) {
      const canvas = mountRef.current.querySelector("canvas");
      textureManagerRef.current.preloadWithWebGLCapabilities(canvas);
    }
  }, [materialSelections]);

  return {
    setCameraView,
    handleZoom,
  };
};
