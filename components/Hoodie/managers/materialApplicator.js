import * as THREE from "three";
import { getMeshPartType } from "../utils/meshUtils";
import { defaultMaterialSelections } from "../config/materialConfig";

export class MaterialApplicator {
  constructor(textureManager) {
    this.textureManager = textureManager;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }

  setRenderingContext(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  applyMaterialsAndColors(rootObject, customColors, materialSelections = defaultMaterialSelections) {
    if (!rootObject) return;

    // Apply materials and colors to the model
    rootObject.traverse((child) => {
      if (child.isMesh && child.material && child.name) {
        // Get part type and material ID using the mapping
        const { partType, materialPartId } = getMeshPartType(child.name);

        // Handle material application based on part type
        if (partType === "zipperDetails") {
          this.applyZipperDetailsMaterial(child, partType, customColors);
        } else if (partType && materialPartId) {
          this.applyFabricMaterial(child, partType, materialPartId, customColors, materialSelections);
        }
      }
    });

    // Force a re-render after applying materials
    this.forceRender();
  }

  forceRender() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  applyZipperDetailsMaterial(child, partType, customColors) {
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
  }

  applyFabricMaterial(child, partType, materialPartId, customColors, materialSelections) {
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
    const fallbackKey = materialPartId === "lining" ? `${selectedMaterial}_main` : null;

    const materialTextures = this.textureManager.getTextures(materialKey, fallbackKey);

    // Apply material textures if available
    if (materialTextures && materialTextures.diffuse) {
      this.applyTexturedMaterial(child, materialTextures, partType, customColors);
    } else {
      this.applyFallbackMaterial(child, partType, customColors);
    }

    child.material.needsUpdate = true;
  }

  applyTexturedMaterial(child, materialTextures, partType, customColors) {
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
  }

  applyFallbackMaterial(child, partType, customColors) {
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
}