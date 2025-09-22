// Material options for hoodie customization
export const materialOptions = {
  cotton: {
    name: "Cotton",
    price: 0,
    displayPrice: "+0kr",
    id: "cotton",
    texturePrefix: "cotton",
    previewImage: "/images/Cotton_Material.jpg"
  },
  teddy: {
    name: "Teddy",
    price: 20,
    displayPrice: "+20kr",
    id: "teddy",
    texturePrefix: "teddy",
    previewImage: "/images/Teddy_Material.jpg"
  },
  nylon: {
    name: "Nylon",
    price: 50,
    displayPrice: "+50kr",
    id: "nylon",
    texturePrefix: "nylon",
    previewImage: "/images/Nylon_Material.jpg"
  }
};

// Part mappings for material application (matches the naming convention in the new model)
export const materialPartMapping = {
  main: "1001",      // Main body material
  lining: "1001"     // Hood interior/lining material - using same textures as main since 999 textures don't exist
  // Note: details (981) removed - zipper should remain metallic, not fabric
};

// Generate texture paths for a given material and part
export const getTexturePaths = (materialId, partId) => {
  const material = materialOptions[materialId];
  if (!material) {
    console.warn(`Material not found: ${materialId}`);
    return null;
  }

  const partSuffix = materialPartMapping[partId];
  if (!partSuffix) {
    console.warn(`Part mapping not found for: ${partId}`);
    return null;
  }

  const basePath = "/hoodie-materials/";

  return {
    diffuse: `${basePath}${material.texturePrefix}_diffuse_${partSuffix}.png`,
    normal: `${basePath}${material.texturePrefix}_normal_${partSuffix}.png`,
    metallicRoughness: `${basePath}${material.texturePrefix}_metallicroughness_${partSuffix}.png`
  };
};

// Default material selections
export const defaultMaterialSelections = {
  main: "cotton",
  lining: "cotton"
};

// Calculate total additional cost based on material selections
export const calculateMaterialCost = (selections) => {
  return Object.values(selections).reduce((total, materialId) => {
    const material = materialOptions[materialId];
    return total + (material ? material.price : 0);
  }, 0);
};

// Part display names for UI
export const partDisplayNames = {
  main: "Main material",
  lining: "Lining material"
};