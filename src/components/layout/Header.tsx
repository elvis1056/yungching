"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>台北景點探索</span>
        <nav className={styles.nav}>
          <Link
            href="/attractions"
            className={`${styles.navLink} ${pathname === "/attractions" ? styles.active : ""}`}
          >
            景點列表
          </Link>
          <Link
            href="/favorites"
            className={`${styles.navLink} ${pathname === "/favorites" ? styles.active : ""}`}
          >
            我的最愛
          </Link>
        </nav>
      </div>
    </header>
  );
}
