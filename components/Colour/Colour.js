import { ContinueButton } from "../button/continueButton/ContinueButton";
import { ColorCustomization } from "../Hoodie/components/ColorCustomization";




export const Colour = ({ customColors, onColorChange, handleOnClick }) => {

  return (
    <div>

      <ColorCustomization
        customColors={customColors}
        onColorChange={onColorChange}
      />

      {/* <ContinueButton onClick={handleOnClick}>Add to cart</ContinueButton> */}
    </div>
  );
};
