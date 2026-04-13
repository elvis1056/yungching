import type { Category } from "@/types/attraction";
import styles from "./CategoryFilter.module.scss";

interface Props {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryFilter({ categories, selectedId, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value === "" ? null : Number(value));
  };

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={selectedId ?? ""}
        onChange={handleChange}
      >
        <option value="">全部分類</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
