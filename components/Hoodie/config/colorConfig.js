// Available colors for each part (3 colors each)
export const colorOptions = {
  body: [
    { name: "Green", color: "#7A8471" },
    { name: "Grey", color: "#8B8B8B" },
    { name: "Cream", color: "#E8DCC6" }
  ],
  hoodInterior: [
    { name: "Green", color: "#7A8471" },
    { name: "Grey", color: "#8B8B8B" },
    { name: "Black", color: "#1C1C1C" },
    { name: "Cream", color: "#E8DCC6" }
  ],
  zipperDetails: [
    { name: "Bronze", color: "#CD7F32" },
    { name: "Dark Grey", color: "#4A4A4A" },
    { name: "Light Grey", color: "#8B8B8B" }
  ]
};

// Map mesh names to customization parts
export const partMapping = {
  body: [
    "Main_fabric", "Sleeves", "Body_Back", "Body_Front",
    "Cuff_outside", "Cuff_inside", "Hood_outside"
  ],
  hoodInterior: [
    "Hood_inside", "Lining_fabric", "Trim", "Stopper"
  ],
  zipperDetails: [
    "Zipper", "Piping_27584630", "Piping_27606017", "Piping_32967410", "Piping_33094821", "Straps_1", "Straps_2"
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