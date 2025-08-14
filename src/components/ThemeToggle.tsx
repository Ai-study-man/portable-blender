"use client";
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const s = localStorage.getItem('theme');
    if (s === 'dark' || s === 'light') return s as 'dark'|'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme, mounted]);

  function toggle() { setTheme(t => t === 'dark' ? 'light' : 'dark'); }

  const label = theme === 'dark' ? '🌙' : '☀️';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-300/70 dark:border-slate-600/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur text-base shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-fuchsia-500 transition"
    >
      <span className="text-sm" suppressHydrationWarning>{label}</span>
    </button>
  );
}

export default ThemeToggle;
