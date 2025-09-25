import { partMapping } from "../config/colorConfig";

export const getMeshPartType = (meshName) => {
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