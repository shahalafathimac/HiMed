import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Activity, Moon, Sun } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

export default function PublicLayout() {
  const { isAuthenticated } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('himed-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update theme when toggled
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('himed-theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <div className={`flex min-h-screen flex-col bg-slate-50 ${isDarkMode ? 'dark:bg-slate-950' : ''}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">HiMed</span>
          </Link>
          <nav className="ml-8 hidden md:flex gap-6">
            <Link to="/catalog" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300">Catalog</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300">About</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-300">Contact</Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {isAuthenticated ? (
              <Button asChild variant="default">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors ml-4"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; 2026 HiMed Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
