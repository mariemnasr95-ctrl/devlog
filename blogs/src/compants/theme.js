import { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('devlog-theme') === 'light' ? 'light' : 'dark';
        } catch {
            return 'dark';
        }
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = theme;
        try {
            localStorage.setItem('devlog-theme', theme);
        } catch {
            // Theme still applies for this session when storage is unavailable.
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function ThemeToggle() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('ThemeToggle must be used inside ThemeProvider.');
    const { theme, toggleTheme } = context;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    return (
        <button aria-label={`Switch to ${nextTheme} mode`} className="icon-button" onClick={toggleTheme} title={`Switch to ${nextTheme} mode`} type="button">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}