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

  const hydrated = useHydration();
  const favorites = useFavoritesStore((s) => s.favorites);
  const updateFavorite = useFavoritesStore((s) => s.updateFavorite);

  if (!hydrated) {
    return <div className={styles.container} />;
  }

  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = favorites.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

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
      <h2 className={styles.heading}>我的最愛（{favorites.length}）</h2>
      <div className={styles.grid}>
        {pageItems.map((attraction) => (
          <div key={attraction.id} className={styles.cardWrapper}>
            <AttractionCard attraction={attraction} />
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
