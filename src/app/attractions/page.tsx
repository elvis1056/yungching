"use client";

import { useEffect, useState } from "react";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import Pagination from "@/components/Pagination/Pagination";
import { fetchAttractions, fetchCategories } from "@/lib/api";
import type { Attraction, Category } from "@/types/attraction";
import styles from "./page.module.scss";

const PAGE_SIZE = 30;

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAttractions({
      page: currentPage,
      categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    })
      .then((res) => {
        setAttractions(res.data);
        setTotal(res.total);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [currentPage, selectedCategoryId]);

  const handleCategoryChange = (id: number | null) => {
    setLoading(true);
    setError(false);
    setCurrentPage(1);
    setSelectedCategoryId(id);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setError(false);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategoryId}
        onChange={handleCategoryChange}
      />
      {loading ? (
        <div className={styles.status}>載入中...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
