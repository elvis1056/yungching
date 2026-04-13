import type { Attraction } from "@/types/attraction";
import styles from "./AttractionCard.module.scss";

interface Props {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: Props) {
  const { name, address, tel, image } = attraction;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} />
        ) : (
          <div className={styles.noImage}>暫無圖片</div>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.meta}>
          {address && (
            <div className={styles.metaItem}>
              <span className={styles.label}>地址</span>
              <span className={styles.value}>{address}</span>
            </div>
          )}
          {tel && (
            <div className={styles.metaItem}>
              <span className={styles.label}>電話</span>
              <span className={styles.value}>{tel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
