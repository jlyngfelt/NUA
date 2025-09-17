import Image from "next/image";
import styles from "./Material.module.css";
import {useState} from 'react';
import { ContinueButton } from "../button/continueButton/ContinueButton";

export const Material = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
<div>
<div className={styles.materialContainer}>
    <h3>Main colour:</h3>
    
</div>
<div className={styles.materialContainer}>
    <h3>Lining colour:</h3>

</div>
<div className={styles.materialContainer}>
    <h3>Zip & details colour:</h3>

</div>

<ContinueButton>Continue</ContinueButton>
</div>
    )
}