import { useRef, useState } from "react";
import styles from "./Hoodie.module.css";
import { ColorCustomization } from './components/ColorCustomization';
import { CameraControls } from './components/CameraControls';
import { useHoodieModel } from './hooks/useHoodieModel';

export const Hoodie = ({ customColors, onColorChange, materialSelections }) => {
  const mountRef = useRef(null);

  // Initialize 3D model and get control functions
  const { setCameraView, handleZoom } = useHoodieModel(mountRef, customColors, materialSelections);



  return (
    <div className={styles.container}>
      <div ref={mountRef} />

      {/* <ColorCustomization
        customColors={customColors}
        onColorChange={handleColorChange}
      /> */}

      <CameraControls
        onViewChange={setCameraView}
        onZoom={handleZoom}
      />
    </div>
  );
};