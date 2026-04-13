# 台北景點探索

永慶房屋前端工程師面試作業 — 使用台北旅遊網 Open API 開發的 SPA 景點瀏覽與收藏系統。

## 功能列表

**網頁 1：景點列表**
- 從台北旅遊網 API 取得景點資料，以卡片形式顯示圖片、名稱、地址、電話
- 分頁切換（上一頁 / 下一頁）
- 下拉選單依分類篩選（categoryIds），切換後頁碼重置為第 1 頁
- 勾選單筆或多筆景點，批次加入我的最愛
- 已收藏的景點顯示「已收藏」標記

**網頁 2：我的最愛**
- 列出所有已收藏景點，支援前端分頁
- 單筆編輯（名稱、電話、地址），含欄位驗證：
  - 景點名稱：必填
  - 電話：不可輸入中文
- 勾選單筆或多筆，批次移除（含確認對話框）
- 全選本頁 / 取消全選
- 收藏資料儲存於 localStorage，重整後保留

## 技術選型

| 項目 | 選擇 | 原因 |
|------|------|------|
| 框架 | Next.js 14+ (App Router) | SSR + Client Component 混用，路由結構清晰 |
| 語言 | TypeScript | 型別安全，減少執行期錯誤 |
| 樣式 | 純手刻 SCSS | 題目要求不套 UI 框架，展示 CSS 切版能力 |
| 狀態管理 | Zustand + persist middleware | 輕量、API 簡潔，搭配 localStorage 持久化 |
| API 代理 | Next.js Route Handler | 統一錯誤處理與資料轉換，封裝外部 API 細節 |

## 啟動方式

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 專案架構

```
src/
├── app/
│   ├── api/
│   │   ├── attractions/route.ts   # 景點資料代理
│   │   └── categories/route.ts    # 分類資料代理
│   ├── attractions/page.tsx       # 網頁 1：景點列表
│   ├── favorites/page.tsx         # 網頁 2：我的最愛
│   ├── layout.tsx                 # 全域 Layout
│   └── globals.scss
├── components/
│   ├── layout/Header.tsx          # 導覽列
│   ├── AttractionCard/            # 景點卡片（含 checkbox）
│   ├── Pagination/                # 通用分頁元件
│   ├── CategoryFilter/            # 分類下拉選單
│   └── EditFavoriteModal/         # 編輯 Modal（含表單驗證）
├── store/
│   └── useFavoritesStore.ts       # Zustand store + localStorage
├── hooks/
│   └── useHydration.ts            # SSR hydration 偵測
├── lib/
│   └── api.ts                     # 前端 fetch 封裝
├── types/
│   └── attraction.ts              # TypeScript 型別定義
└── styles/
    ├── _variables.scss            # 色彩、斷點、間距變數
    ├── _mixins.scss               # RWD mixin、flex 工具
    └── _reset.scss                # CSS reset
```

## RWD 斷點

| 斷點 | 寬度 |
|------|------|
| 桌面 | > 1024px（景點卡片 3 欄） |
| 平板 | ≤ 1024px（景點卡片 2 欄） |
| 手機 | ≤ 768px（景點卡片 1 欄） |
