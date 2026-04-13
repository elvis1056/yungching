# 永慶房屋 前端面試作業 — Commit 開發計畫

## 技術選型

| 項目 | 選擇 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 語言 | TypeScript |
| 樣式 | 純手刻 SCSS (無 UI 框架) |
| 狀態管理 | Zustand + localStorage 持久化 |
| API 來源 | 台北旅遊網 Open API |
| API 代理 | Next.js Route Handler (解決 CORS) |
| 套件管理 | npm |

### Commit 規範

#### Commit Message 格式

```
<type>: <English short description>

English details:
- point 1
- point 2

中文說明：
- 點 1
- 點 2

【Revert 說明】
📦 依賴項：<列出此 commit 依賴的其他 commit>
⚠️  如需 revert：<說明 revert 的影響和注意事項>
✅ 獨立 revert：<說明是否可以單獨 revert>
🔧 影響功能：<列出會受影響的功能>
```

**語言規範**：
- 第一行（標題）：**英文**
- Body 先寫英文說明，再附上中文翻譯
- 標題和 body 中間空一行

**❌ Commit message 內容規範**

- **禁止使用只有當前對話才看得懂的術語**（如「option C」、「路線 2」、「斷點 4」等內部討論用語）。Commit message 要讓任何人在沒有上下文的情況下也能理解改了什麼、為什麼改。
- **【Revert 說明】只寫 revert 這個 commit 本身的影響**，不要夾帶 todo list、未完成項目提醒或其他與 revert 無關的資訊。

**❌ 重要：不要添加 Co-Authored-By**
```
# ❌ 錯誤：不要加入 Co-Authored-By
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

# ✅ 正確：直接結束 commit message
```

#### Type 類型

| Type     | 說明                   |
| -------- | ---------------------- |
| feat     | 新功能                 |
| fix      | 修正錯誤               |
| perf     | 效能優化               |
| refactor | 重構（不改變功能）     |
| style    | 樣式調整（不影響邏輯） |
| docs     | 文件更新               |
| chore    | 建構工具、依賴更新     |

#### 切分 Commit 原則

**✅ 好的切分**：

- 每個 commit 完成一個完整的小功能
- 可以單獨 revert 而不影響其他功能
- 從 commit message 就能理解改了什麼
- 相關的檔案放在同一個 commit

**❌ 避免**：

- 太大的 commit（難以 revert）
- 太碎的 commit（失去上下文）
- 混合不相關的改動

---

## Commit 計畫（共 12 個 Commit）

---

### Commit 1 — 專案初始化
**中文**：初始化 Next.js 14 專案，設定 TypeScript 及 SCSS 環境  
**English**：Initialize Next.js 14 project with TypeScript and SCSS configuration  
**Revert 影響**：整個專案消失，所有後續開發基礎不存在

**工作內容**：
- `npx create-next-app@latest` (TypeScript + App Router + SCSS)
- 設定 `tsconfig.json` path alias (`@/`)
- 清除預設樣式與頁面內容
- 建立 SCSS 基礎結構：`styles/` 資料夾（`_variables.scss`, `_mixins.scss`, `_reset.scss`, `globals.scss`）
- 設定 `.gitignore`, `README.md`

---

### Commit 2 — 專案結構與全域佈局
**中文**：建立專案資料夾結構、全域 Layout 及導覽列元件  
**English**：Set up project folder structure, global layout, and navigation component  
**Revert 影響**：失去統一的頁面框架與導覽功能，頁面間無法切換

**工作內容**：
- 建立資料夾結構：
  ```
  src/
    app/
      layout.tsx          ← 全域 Layout
      page.tsx            ← 首頁（重導到景點列表）
      attractions/
        page.tsx          ← 網頁1：景點列表
      favorites/
        page.tsx          ← 網頁2：我的最愛
    components/
      layout/
        Header.tsx
        Header.module.scss
    styles/
  ```
- 實作 Header 導覽列（含「景點列表」與「我的最愛」兩個連結）
- 全域 Layout 套用 Header
- 基礎 RWD 斷點定義在 `_variables.scss` 中（如 `$breakpoint-mobile: 768px`）

---

### Commit 3 — API Route 代理層
**中文**：建立 Next.js Route Handler 作為台北旅遊網 API 的代理層，實現 API 抽象化  
**English**：Create Next.js Route Handler as API abstraction layer for Taipei Travel API  
**Revert 影響**：前端必須直接耦合外部 API，失去統一的錯誤處理與資料轉換層

**工作內容**：
- 建立 `app/api/attractions/route.ts`
- 實作 GET handler：
  - 接收前端 query params（`page`, `categoryIds`）
  - 轉發請求到 `https://www.travel.taipei/open-api/zh-tw/Attractions/All`
  - 帶上必要 headers（`Accept: application/json`）
  - Server 端統一做 error handling（API 逾時、非 200 回應等）
  - 可選：data transform，只回傳前端需要的欄位，減少傳輸量
  - 回傳資料給前端
- 建立 `lib/api.ts`：封裝前端呼叫 `/api/attractions` 的 fetch 函式
- 定義 TypeScript 型別：`types/attraction.ts`（景點資料介面）

**為什麼加這層？（面試可能會被問）**：
台北旅遊網 API 本身已允許跨域存取（CORS），前端可以直接呼叫。
但仍選擇透過 Route Handler 代理，原因如下：
1. **封裝外部 API 細節**：若 API 網址、參數格式、回傳結構變動，只需改 server 端一處，前端不受影響
2. **統一錯誤處理**：在 server 端攔截外部 API 的異常狀態，回傳前端一致的錯誤格式
3. **資料轉換**：可在 server 端精簡回傳欄位，避免將整包原始資料丟給 client

```
瀏覽器 → /api/attractions?page=1 → Next.js Server（錯誤處理 + 資料轉換）→ travel.taipei API → 回傳精簡 JSON
```

---

### Commit 4 — 景點列表基礎渲染
**中文**：實作景點列表頁面，串接 API 並顯示景點卡片  
**English**：Implement attractions list page with API integration and card display  
**Revert 影響**：景點列表頁空白，無法看到任何景點資料

**工作內容**：
- 實作 `attractions/page.tsx`：Client Component，呼叫 API 取得景點列表
- 建立 `components/AttractionCard/` 元件（圖片 + 名稱 + 地址 + 電話）
- 建立對應 SCSS module：`AttractionCard.module.scss`
- 處理 loading 狀態與 error 狀態
- 卡片排列使用 CSS Grid，手刻 RWD（桌面 3 欄 / 平板 2 欄 / 手機 1 欄）

---

### Commit 5 — 分頁元件
**中文**：實作通用分頁元件，套用至景點列表頁  
**English**：Implement reusable pagination component and apply to attractions list  
**Revert 影響**：只能看到第一頁資料，無法切換「上一頁」「下一頁」

**工作內容**：
- 建立 `components/Pagination/Pagination.tsx` 通用分頁元件
- Props 設計：`currentPage`, `totalPages`, `onPageChange`
- 包含「上一頁」、「下一頁」按鈕 + 頁碼顯示
- 對應 SCSS module
- 在 `attractions/page.tsx` 中整合分頁邏輯

---

### Commit 6 — 分類篩選功能
**中文**：實作下拉式選單篩選景點分類（categoryIds）  
**English**：Implement category filter dropdown for attractions filtering  
**Revert 影響**：無法依分類篩選景點，只能看到全部資料

**工作內容**：
- 建立 `components/CategoryFilter/CategoryFilter.tsx`
- 呼叫台北旅遊網的分類 API 或以常用分類硬編碼
- 下拉選單切換時重新呼叫 API（帶入 `categoryIds` 參數）
- 篩選後頁碼重置為第 1 頁
- 對應 SCSS module

---

### Commit 7 — Zustand Store 與我的最愛核心邏輯
**中文**：建立 Zustand store，實作我的最愛新增/移除功能與 localStorage 持久化  
**English**：Set up Zustand store with add/remove favorites and localStorage persistence  
**Revert 影響**：失去所有「我的最愛」功能，收藏資料無法保存，網頁重整後資料消失

**工作內容**：
- 安裝 zustand：`npm install zustand`
- 建立 `store/useFavoritesStore.ts`
- Store 設計：
  ```typescript
  interface FavoritesStore {
    favorites: Attraction[];
    addFavorite: (item: Attraction) => void;
    removeFavorites: (ids: string[]) => void;
    updateFavorite: (id: string, data: Partial<Attraction>) => void;
    isFavorite: (id: string) => boolean;
  }
  ```
- 使用 zustand 的 `persist` middleware 綁定 localStorage
- 處理 SSR hydration 問題（詳見下方說明）
- 封裝 `hooks/useHydration.ts` 供所有依賴 store 的頁面統一使用

**⚠️ SSR Hydration 問題說明**：

Next.js App Router 預設會在 server 端先渲染 HTML，再由 client 端 hydration 接手。
兩次渲染結果必須一致，否則 React 會報 hydration mismatch 錯誤。

問題在於：**server 端沒有 localStorage**，所以 Zustand store 在 server 端永遠是初始空值，
但 client 端 hydration 時 `persist` middleware 會從 localStorage 讀出已存的收藏資料，導致兩邊不一致。

```
Server 渲染 → favorites = []      → 輸出「尚無收藏」
Client 渲染 → favorites = [A,B,C] → 預期輸出 3 張卡片 → ❌ Mismatch!
```

**解法：延遲渲染 store 相關內容，直到 client 端 hydration 完成**

```tsx
// hooks/useHydration.ts
import { useState, useEffect } from 'react';

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated;
}

// 使用方式（任何依賴 store 的頁面）
export default function FavoritesPage() {
  const hydrated = useHydration();
  const favorites = useFavoritesStore((s) => s.favorites);

  if (!hydrated) return <LoadingSkeleton />;
  return <div>{favorites.map(...)}</div>;
}
```

原理：`useEffect` 只在 client 端執行，因此 server 和 client 首次都渲染 `<LoadingSkeleton />`（一致），
待 hydration 完成後才觸發 `setHydrated(true)`，重新渲染時讀取真正的 store 資料。

---

### Commit 8 — 景點列表加入我的最愛功能
**中文**：在景點列表頁實作勾選功能，可單筆或多筆加入我的最愛  
**English**：Add checkbox selection to attractions list for adding single/multiple favorites  
**Revert 影響**：景點列表頁無法勾選與收藏，我的最愛功能在此頁不可用

**工作內容**：
- 在 `AttractionCard` 加入 checkbox 勾選
- 建立已勾選狀態管理（local state: `selectedIds`）
- 建立「加入我的最愛」按鈕（批次操作）
- 已收藏的景點顯示視覺標記（如愛心 icon 或不同底色）
- 防止重複收藏

---

### Commit 9 — 我的最愛列表頁與分頁
**中文**：實作我的最愛頁面，列出收藏景點並支援分頁  
**English**：Implement favorites page with list display and pagination  
**Revert 影響**：無法檢視已收藏的景點清單，我的最愛頁面空白

**工作內容**：
- 實作 `favorites/page.tsx`
- 從 Zustand store 讀取收藏資料
- 複用 `Pagination` 元件（前端分頁，因為資料在 client 端）
- 複用 `AttractionCard` 或建立 `FavoriteCard` 元件
- 空狀態處理（尚無收藏時顯示提示）

---

### Commit 10 — 我的最愛編輯功能（含表單驗證）
**中文**：實作我的最愛單筆編輯功能，包含欄位驗證邏輯  
**English**：Implement single favorite item editing with form field validation  
**Revert 影響**：無法修改收藏景點的資訊，失去表單驗證功能

**工作內容**：
- 建立 `components/EditFavoriteModal/EditFavoriteModal.tsx`（Modal 或 inline 編輯）
- 可編輯欄位：景點名稱、電話、地址、備註…
- 驗證規則：
  - 景點名稱：必填
  - 電話：不可輸入中文（正則驗證）
  - 其他自訂規則（如地址長度限制）
- 驗證未通過時顯示錯誤訊息，不允許送出
- 通過驗證後更新 Zustand store
- 對應 SCSS module

---

### Commit 11 — 我的最愛批次移除功能
**中文**：實作我的最愛頁面的勾選與批次移除功能  
**English**：Implement checkbox selection and batch removal in favorites page  
**Revert 影響**：無法從我的最愛中移除景點，收藏清單無法管理

**工作內容**：
- 在我的最愛卡片加入 checkbox
- 「全選」/ 「取消全選」功能
- 「移除選取」按鈕（需確認對話框）
- 移除後自動更新列表與分頁

---

### Commit 12 — RWD 優化、最終調整與 README
**中文**：完善 RWD 響應式設計、修正樣式細節、補充 README 文件  
**English**：Finalize RWD responsive design, polish styles, and complete README documentation  
**Revert 影響**：失去最終的 RWD 調整與文件說明，行動裝置體驗可能不佳

**工作內容**：
- 全面檢查所有斷點下的排版（桌面 / 平板 / 手機）
- Header 導覽列 RWD（漢堡選單或其他方案）
- Modal / 表單的行動裝置適配
- 完善 `README.md`：
  - 專案說明、技術選型理由
  - 啟動方式（`npm install` → `npm run dev`）
  - 專案架構說明
  - 功能列表

---

## 資料夾結構預覽

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.scss
│   ├── api/
│   │   └── attractions/
│   │       └── route.ts          ← API 代理
│   ├── attractions/
│   │   ├── page.tsx              ← 網頁 1
│   │   └── page.module.scss
│   └── favorites/
│       ├── page.tsx              ← 網頁 2
│       └── page.module.scss
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Header.module.scss
│   ├── AttractionCard/
│   ├── Pagination/
│   ├── CategoryFilter/
│   └── EditFavoriteModal/
├── store/
│   └── useFavoritesStore.ts      ← Zustand
├── hooks/
│   └── useHydration.ts           ← SSR hydration 處理
├── lib/
│   └── api.ts                    ← API 呼叫封裝
├── types/
│   └── attraction.ts             ← TypeScript 型別
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    └── _reset.scss
```

---

## 提示：面試時 5~10 分鐘導覽建議重點

1. **技術選型理由**（為何選 Next.js + Zustand，CORS 怎麼解決）
2. **Live Demo**（跑過一次完整流程：瀏覽 → 篩選 → 收藏 → 切到我的最愛 → 編輯 → 移除）
3. **程式架構**（資料夾結構、元件拆分邏輯、Store 設計）
4. **RWD 展示**（用 DevTools 切換不同裝置寬度）
5. **Git 歷程**（展示 commit log，說明開發節奏）