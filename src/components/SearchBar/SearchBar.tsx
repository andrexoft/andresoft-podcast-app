"use client";

import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      className={styles.search}
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar podcasts..."
      aria-label="Buscar podcasts por título o autor"
    />
  );
}