"use client";

import { useEffect, useState } from "react";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import Pagination from "@/components/Pagination/Pagination";
import { fetchAttractions } from "@/lib/api";
import type { Attraction } from "@/types/attraction";
import styles from "./page.module.scss";

const PAGE_SIZE = 30;

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    fetchAttractions({ page: currentPage })
      .then((res) => {
        setAttractions(res.data);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setLoading(true);
    setError(false);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
