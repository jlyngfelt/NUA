import Image from "next/image";
import styles from "./Colour.module.css";
import {useState} from 'react';
import { ContinueButton } from "../button/continueButton/ContinueButton";

export const Colour = ({handleOnClick}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
<div>
<div className={styles.colourContainer}>
    <h3>Main colour:</h3>
    
</div>
<div className={styles.colourContainer}>
    <h3>Lining colour:</h3>

</div>
<div className={styles.colourContainer}>
    <h3>Zip & details colour:</h3>

</div>

<ContinueButton onClick={handleOnClick}>Add to cart</ContinueButton>
</div>
    )
}