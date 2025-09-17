import styles from "./Description.module.css";

export const Description = () => {
  return <div className={styles.descriptionContainer}>
    <div className={styles.descriptionContainerBox}>
    <h3>Product information</h3>
    <h4>Warm, soft and durable, the Better Sweater™ ½-Zip Pullover is made with 100% recycled material and dyed with a low-impact process to reduce the use of dyestuffs, energy and water compared to conventional heather dyeing methods. Sweater-knit aesthetic dresses up for the office or down for the trail. Made in a Fair Trade Certified™ factory.</h4>
    </div>
    <div className={styles.descriptionContainerBox}>
    <h3>Sustainability</h3>
    <h4>Warm, soft and durable, the Better Sweater™ ½-Zip Pullover is made with 100% recycled material and dyed with a low-impact process to reduce the use of dyestuffs, energy and water compared to conventional heather dyeing methods. Sweater-knit aesthetic dresses up for the office or down for the trail. Made in a Fair Trade Certified™ factory.</h4>
    </div>
  </div>;
};
