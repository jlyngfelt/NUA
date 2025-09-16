import { colorOptions } from '../config/colorConfig';
import styles from './ColorCustomization.module.css';

export const ColorCustomization = ({ customColors, onColorChange }) => {
  return (
    <div className={styles.colorCustomizationPanel}>
      {/* Main fabric colour */}
      <div className={styles.colorSection}>
        <h4>Main fabric colour</h4>
        <div className={styles.colorOptions}>
          {colorOptions.body.map((option) => (
            <button
              key={option.name}
              onClick={() => onColorChange('body', option.color)}
              className={`${styles.colorButton} ${customColors.body === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className={styles.colorSection}>
        <h4>Details</h4>
        <div className={styles.colorOptions}>
          {colorOptions.hoodInterior.map((option) => (
            <button
              key={option.name}
              onClick={() => onColorChange('hoodInterior', option.color)}
              className={`${styles.colorButton} ${customColors.hoodInterior === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
          ))}
        </div>
      </div>

      {/* Metallics/plastic */}
      <div className={styles.colorSection}>
        <h4>Metallics/plastic</h4>
        <div className={styles.colorOptions}>
          {colorOptions.zipperDetails.map((option) => (
            <button
              key={option.name}
              onClick={() => onColorChange('zipperDetails', option.color)}
              className={`${styles.colorButton} ${customColors.zipperDetails === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};