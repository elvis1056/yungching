"use client";

import { useEffect, useState } from "react";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import Pagination from "@/components/Pagination/Pagination";
import { fetchAttractions, fetchCategories } from "@/lib/api";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useHydration } from "@/hooks/useHydration";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hydrated = useHydration();
  const addFavorites = useFavoritesStore((s) => s.addFavorites);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

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
    setSelectedIds(new Set());
    setSelectedCategoryId(id);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setError(false);
    setSelectedIds(new Set());
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleAddFavorites = () => {
    const selected = attractions.filter((a) => selectedIds.has(a.id));
    addFavorites(selected);
    setSelectedIds(new Set());
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
      <div className={styles.toolbar}>
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategoryId}
          onChange={handleCategoryChange}
        />
        {hydrated && selectedIds.size > 0 && (
          <button className={styles.addButton} onClick={handleAddFavorites}>
            加入我的最愛（{selectedIds.size}）
          </button>
        )}
      </div>
      {loading ? (
        <div className={styles.status}>載入中...</div>
      ) : (
        <>
          <div className={styles.grid}>
            {attractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                selectable
                selected={selectedIds.has(attraction.id)}
                isFavorite={hydrated && isFavorite(attraction.id)}
                onSelect={handleSelect}
              />
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
