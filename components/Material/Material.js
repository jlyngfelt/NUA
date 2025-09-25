import Image from "next/image";
import styles from "./Material.module.css";
import { ContinueButton } from "../button/continueButton/ContinueButton";
import { materialOptions, partDisplayNames, defaultMaterialSelections } from "../Hoodie/config/materialConfig";

export const Material = ({ handleOnClick, materialSelections = defaultMaterialSelections, onMaterialChange }) => {

  const handleMaterialSelect = (partId, materialId) => {
    if (onMaterialChange) {
      onMaterialChange(partId, materialId);
    }
  };

  const renderMaterialOptions = (partId) => {
    return (
      <div className={styles.materialOptions}>
        {Object.entries(materialOptions).map(([materialId, material]) => (
          <div
            key={materialId}
            className={`${styles.materialOption} ${
              materialSelections[partId] === materialId ? styles.selected : ''
            }`}
            onClick={() => handleMaterialSelect(partId, materialId)}
          >
            <div className={styles.materialPreview}>
              <Image
                src={material.previewImage}
                alt={material.name}
                width={120}
                height={120}
                className={styles.materialImage}
              />
            </div>
            <div className={styles.materialInfo}>
              <span className={styles.materialName}>{material.name} {material.displayPrice}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.materialContainer}>
      {Object.entries(partDisplayNames).map(([partId, partName]) => (
        <div key={partId} className={styles.materialSection}>
          <h3 className={styles.sectionTitle}>{partName}:</h3>
          {renderMaterialOptions(partId)}
        </div>
      ))}

      {/* <ContinueButton onClick={handleOnClick}>Continue</ContinueButton> */}
    </div>
  );
};