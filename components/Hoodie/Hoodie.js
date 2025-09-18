import { useRef, useState } from "react";
import styles from "./Hoodie.module.css";
import { ColorCustomization } from './components/ColorCustomization';
import { CameraControls } from './components/CameraControls';
import { useHoodieModel } from './hooks/useHoodieModel';
import { defaultColors } from './config/colorConfig';

export const Hoodie = ({ customColors, onColorChange }) => {
  const mountRef = useRef(null);

  // Initialize 3D model and get control functions
  const { setCameraView, handleZoom } = useHoodieModel(mountRef, customColors);



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