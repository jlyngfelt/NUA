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
    { name: "Green", color: "#7A8471" },
    { name: "Dark Grey", color: "#4A4A4A" },
    { name: "Light Grey", color: "#8B8B8B" }
  ]
};

// Map mesh names to customization parts - Updated with actual mesh names from console
export const partMapping = {
  body: [
    "Sleeves", "Body_Back", "Body_Front_2", "Body_Front_3", "Body_Front_4", "Body_Front_5",
    "Cuff_outside_1", "Cuffs_outside_2", "Hood_outside_1", "Hood_outside_2", "Hood_outside_edge"
  ],
  hoodInterior: [
    "Hood_inside_1", "Hood_inside_2", "Cuff_inside_1", "Cuffs_inside_2"
  ],
  zipperDetails: [
    // Zippers
    "Zipper_1", "Zipper_1_1", "Zipper_1_2", "Zipper_1_3", "Zipper_1_4", "Zipper_1_5",
    "Zipper_2", "Zipper_2_1", "Zipper_2_2", "Zipper_2_3", "Zipper_2_4",
    "Zipper_3", "Zipper_3_1", "Zipper_3_2", "Zipper_3_3", "Zipper_3_4",
    // Zipper patterns/tapes
    "ZipperPattern_26790519", "ZipperPattern_26790568", "ZipperPattern_32617876", 
    "ZipperPattern_32617925", "ZipperPattern_32759673", "ZipperPattern_32759722",
    // Stoppers (the toggles on drawstrings)
    "Stopper_02", "Stopper_02_1",
    // Trim pieces
    "Trim_47388421", "Trim_47388410", "Trim_47388410_1", "Trim_47388421_1",
    // Piping
    "Piping_27584630", "Piping_27606017", "Piping_32967410", "Piping_33094821",
    // Binding
    "Binding_34658540",
    // Strings/drawstrings (moved back to zipperDetails but will have fabric properties)
    "Straps_1", "Straps_2",
    // Topstitching
    "Topstitch_32161971", "Topstitch_32162013", "Topstitch_32162055", "Topstitch_32162097",
    "Topstitch_32212049", "Topstitch_32212091", "Topstitch_32212133", "Topstitch_32212175",
    "Topstitch_29920260", "Topstitch_29920302", "Topstitch_28458183", "Topstitch_28458183_1",
    "Topstitch_28477004", "Topstitch_28477004_1", "Topstitch_28495923", "Topstitch_28495923_1",
    "Topstitch_28514940", "Topstitch_28514940_1", "Topstitch_28458225", "Topstitch_28458225_1",
    "Topstitch_28477046", "Topstitch_28477046_1", "Topstitch_28495965", "Topstitch_28495965_1",
    "Topstitch_28514982", "Topstitch_28514982_1", "Topstitch_30383331", "Topstitch_29997034",
    "Topstitch_30000300", "Topstitch_30107501", "Topstitch_30110747", "Topstitch_30145924",
    "Topstitch_30149170", "Topstitch_30191007", "Topstitch_30191009", "Topstitch_30229624",
    "Topstitch_30232890", "Topstitch_30383289", "Topstitch_29901276", "Topstitch_29939102",
    "Topstitch_29958300", "Topstitch_29977610", "Topstitch_30028885", "Topstitch_30067977",
    "Topstitch_29901318", "Topstitch_29939144", "Topstitch_29958342", "Topstitch_29977652",
    "Topstitch_30028863", "Topstitch_30067999"
  ]
};