import Link from 'next/link';
import dynamic from 'next/dynamic';
const ThemeToggle = dynamic(()=>import('./ThemeToggle'), { ssr: false });

export const siteName = 'Portable Blenders Travel Guide';
export const siteDescription = 'Independent reviews and buying guides to help you pick the best portable blender for travel, camping, gym, or office.';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-fuchsia-50 relative">
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-normal bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.12),transparent_60%)]" />
      <Header />
      <main className="flex-1 container py-6 md:py-10 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 dark:bg-slate-900/70 border-b border-slate-200/70 dark:border-slate-700/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
      <div className="container flex items-center justify-between h-14 md:h-16 gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="logo font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">Portable Blenders</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors" href="/">Home</Link>
            <Link className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors" href="/blog">Blog</Link>
            <Link className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors" href="/about">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/blog" className="md:hidden inline-block text-[12px] font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 text-white shadow hover:shadow-md transition">Blog</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300 text-sm relative z-10">
      <div className="container py-10 flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-1 min-w-[240px]">
          <h3 className="text-base font-semibold mb-3 text-white">Portable Blenders Travel Guide</h3>
          <p className="text-slate-400 leading-relaxed text-xs max-w-xs">Independent reviews and buying guides to help you pick the best portable blender for travel, camping, gym, or office.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Site</h4>
          <ul className="space-y-2 text-xs">
            <li><Link className="hover:text-white transition-colors" href="/">Home</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/about">About</Link></li>
            <li><Link className="hover:text-white transition-colors" href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className="md:ml-auto flex flex-col justify-between text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} Portable Blenders Travel Guide.</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
