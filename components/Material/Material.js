import Image from "next/image";
import styles from "./Material.module.css";
import {useState} from 'react';

export const Material = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
<div>
<div className={styles.materialContainer}>
    <h3>Main material</h3>
    
</div>
<div className={styles.materialContainer}>
    <h3>Lining material</h3>

</div>
<div className={styles.materialContainer}>
    <h3>Zip & details material</h3>

</div>

</div>
    )
}