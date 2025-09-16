// Color configuration for hoodie customization

export const defaultColors = {
  body: "#7A8471" , // Default green
  hoodInterior: "#E8E8E8", // Default light gray
  zipperDetails: "#4A4A4A" // Default dark gray
};

// Available colors for each part (3 colors each)
export const colorOptions = {
  body: [
    { name: "Green", color: "#7A8471" },
    { name: "Gray", color: "#8B8B8B" },
    { name: "Cream", color: "#E8DCC6" }
  ],
  hoodInterior: [
    { name: "Green", color: "#7A8471" },
    { name: "Black", color: "#1C1C1C" },
    { name: "Cream", color: "#E8DCC6" }
  ],
  zipperDetails: [
    { name: "Bronze", color: "#CD7F32" },
    { name: "Dark Gray", color: "#4A4A4A" },
    { name: "Light Gray", color: "#8B8B8B" }
  ]
};

// Map mesh names to customization parts
export const partMapping = {
  body: [
    "Main_fabric", "Sleeves", "Body_Back", "Body_Front",
    "Cuff_outside", "Cuff_inside", "Hood_outside"
  ],
  hoodInterior: [
    "Hood_inside", "Lining_fabric", "Trim", "Stopper", "Piping", "Strap"
  ],
  zipperDetails: [
    "Zipper"
  ]
};

// Texture paths for preloading
export const colorwayTextures = {
  A: {
    diffuse: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway A_diffuse_1001.png",
    normal: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway A_normal_1001.png",
    metallicRoughness: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway A_metallicroughness_1001.png"
  },
  B: {
    diffuse: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway B_diffuse_1001.png",
    normal: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway B_normal_1001.png",
    metallicRoughness: "/nua_hoodie_2_colourway 2/nua_hoodie_2_colourway_Colorway B_metallicroughness_1001.png"
  }
};