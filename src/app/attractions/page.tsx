"use client";

import { useEffect, useState } from "react";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import { fetchAttractions } from "@/lib/api";
import type { Attraction } from "@/types/attraction";
import styles from "./page.module.scss";

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAttractions({ page: 1 })
      .then((res) => setAttractions(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.status}>載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={`${styles.status} ${styles.error}`}>
          資料載入失敗，請稍後再試
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {attractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
    </div>
  );
}
