"use client";

import { useState } from "react";
import Link from "next/link";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import EditFavoriteModal from "@/components/EditFavoriteModal/EditFavoriteModal";
import Pagination from "@/components/Pagination/Pagination";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useHydration } from "@/hooks/useHydration";
import type { Attraction } from "@/types/attraction";
import styles from "./page.module.scss";

const PAGE_SIZE = 9;

export default function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<Attraction | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hydrated = useHydration();
  const favorites = useFavoritesStore((s) => s.favorites);
  const updateFavorite = useFavoritesStore((s) => s.updateFavorite);
  const removeFavorites = useFavoritesStore((s) => s.removeFavorites);

  if (!hydrated) {
    return <div className={styles.container} />;
  }

  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = favorites.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const pageIds = pageItems.map((a) => a.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

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

  const handleToggleAll = () => {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleRemove = () => {
    if (!window.confirm(`確定要移除已選取的 ${selectedIds.size} 筆收藏嗎？`)) return;
    removeFavorites([...selectedIds]);
    setSelectedIds(new Set());
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (favorites.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>尚無收藏景點</p>
          <Link href="/attractions">前往景點列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>我的最愛（{favorites.length}）</h2>
        <div className={styles.toolbarActions}>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={handleToggleAll}
            />
            全選本頁
          </label>
          {selectedIds.size > 0 && (
            <button className={styles.removeButton} onClick={handleRemove}>
              移除選取（{selectedIds.size}）
            </button>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        {pageItems.map((attraction) => (
          <div key={attraction.id} className={styles.cardWrapper}>
            <AttractionCard
              attraction={attraction}
              selectable
              selected={selectedIds.has(attraction.id)}
              onSelect={handleSelect}
            />
            <button
              className={styles.editButton}
              onClick={() => setEditingItem(attraction)}
            >
              編輯
            </button>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {editingItem && (
        <EditFavoriteModal
          attraction={editingItem}
          onSave={updateFavorite}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
