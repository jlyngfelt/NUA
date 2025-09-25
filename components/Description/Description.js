import styles from "./Description.module.css";

export const Description = () => {
  return <div className={styles.descriptionContainer}>
    <div className={styles.descriptionContainerBox}>
    <h3>Product information</h3>
    <h4>Warm, soft and durable, the Better Sweater™ ½-Zip Pullover is made with 100% recycled material and dyed with a low-impact process to reduce the use of dyestuffs, energy and water compared to conventional heather dyeing methods. Sweater-knit aesthetic dresses up for the office or down for the trail. Made in a Fair Trade Certified™ factory.</h4>
    </div>
    <div className={styles.descriptionContainerBox}>
    <h3>Sustainability</h3>
    <h4>Crafted with care for the planet, this product is designed to minimize environmental impact without sacrificing comfort or performance. It's made using recycled fibers and produced with resource-conscious methods that cut down on water, energy, and waste. Each piece comes from a Fair Trade Certified™ factory, supporting safe working conditions and fair wages for the people who make it.</h4>
    </div>
  </div>;
};
