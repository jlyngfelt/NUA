import { colorOptions } from '../config/colorConfig';
import styles from './ColorCustomization.module.css';

export const ColorCustomization = ({ customColors, onColorChange }) => {
  return (
    <div className={styles.colorCustomizationPanel}>
      {/* Main fabric colour */}
      <div className={styles.colorSection}>
        <h4>Main colour:</h4>
        <div className={styles.colorOptions}>
          {colorOptions.body.map((option) => (
            <div key={option.name}>
            <button
              
              onClick={() => onColorChange('body', option.color)}
              className={`${styles.colorButton} ${customColors.body === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
          <h2 className={styles.colorName}>{option.name}</h2>
          </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className={styles.colorSection}>
        <h4>Lining Colour:</h4>
        <div className={styles.colorOptions}>
          {colorOptions.hoodInterior.map((option) => (
            <div key={option.name}>
            <button
              
              onClick={() => onColorChange('hoodInterior', option.color)}
              className={`${styles.colorButton} ${customColors.hoodInterior === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
            <h2 className={styles.colorName}>{option.name}</h2>
          </div>
          ))}
        </div>
      </div>

      {/* Metallics/plastic */}
      <div className={styles.colorSection}>
        <h4>Zip & details colour:</h4>
        <div className={styles.colorOptions}>
          {colorOptions.zipperDetails.map((option) => (
            <div key={option.name}>
            <button
              
              onClick={() => onColorChange('zipperDetails', option.color)}
              className={`${styles.colorButton} ${customColors.zipperDetails === option.color ? styles.active : ""}`}
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
            <h2 className={styles.colorName}>{option.name}</h2>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};