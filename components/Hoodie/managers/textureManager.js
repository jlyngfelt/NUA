import * as THREE from "three";
import { getTexturePaths } from "../config/materialConfig";

export class TextureManager {
  constructor() {
    this.materialTexturesRef = { current: {} };
  }

  preloadMaterialTextures(renderer) {
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
          this.materialTexturesRef.current[key] = {
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
  }

  preloadWithWebGLCapabilities(canvas) {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      this.preloadMaterialTextures({
        capabilities: {
          getMaxAnisotropy: () =>
            gl.getParameter(gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 16,
        },
      });
    }
  }

  getTextures(materialKey, fallbackKey) {
    let materialTextures = this.materialTexturesRef.current[materialKey];

    // Fallback for lining material if textures don't exist
    if (!materialTextures && fallbackKey) {
      materialTextures = this.materialTexturesRef.current[fallbackKey];
    }

    return materialTextures;
  }

  dispose() {
    Object.values(this.materialTexturesRef.current).forEach(textures => {
      if (textures.diffuse) textures.diffuse.dispose();
      if (textures.normal) textures.normal.dispose();
      if (textures.metallicRoughness) textures.metallicRoughness.dispose();
    });
    this.materialTexturesRef.current = {};
  }
}