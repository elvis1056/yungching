import type { Attraction } from "@/types/attraction";
import styles from "./AttractionCard.module.scss";

interface Props {
  attraction: Attraction;
  selectable?: boolean;
  selected?: boolean;
  isFavorite?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}

export default function AttractionCard({
  attraction,
  selectable = false,
  selected = false,
  isFavorite = false,
  onSelect,
}: Props) {
  const { id, name, address, tel, image } = attraction;

  return (
    <div className={`${styles.card} ${selected ? styles.selected : ""}`}>
      <div className={styles.imageWrapper}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} />
        ) : (
          <div className={styles.noImage}>暫無圖片</div>
        )}
      </div>
      {selectable && (
        <div className={styles.checkboxRow}>
          <label>
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect?.(id, e.target.checked)}
            />
            選取
          </label>
          {isFavorite && (
            <span className={styles.favoriteBadge}>已收藏</span>
          )}
        </div>
      )}
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
