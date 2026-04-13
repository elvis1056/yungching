import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Attraction } from "@/types/attraction";

interface FavoritesStore {
  favorites: Attraction[];
  addFavorites: (items: Attraction[]) => void;
  removeFavorites: (ids: string[]) => void;
  updateFavorite: (id: string, data: Partial<Attraction>) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorites: (items) =>
        set((state) => {
          const existingIds = new Set(state.favorites.map((f) => f.id));
          const newItems = items.filter((item) => !existingIds.has(item.id));
          return { favorites: [...state.favorites, ...newItems] };
        }),

      removeFavorites: (ids) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => !ids.includes(f.id)),
        })),

      updateFavorite: (id, data) =>
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.id === id ? { ...f, ...data } : f
          ),
        })),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    { name: "favorites" }
  )
);
