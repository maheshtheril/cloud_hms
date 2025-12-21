'use client'

import { useTheme } from '@/contexts/theme-context'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            onClick={toggleTheme}
            size="sm"
            className="relative group bg-gradient-to-r from-purple-600/10 to-cyan-600/10 hover:from-purple-600/20 hover:to-cyan-600/20 dark:from-purple-500/20 dark:to-cyan-500/20 dark:hover:from-purple-500/30 dark:hover:to-cyan-500/30 border-purple-500/30 dark:border-purple-400/30 backdrop-blur-sm shadow-lg transition-all duration-300"
            variant="outline"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />

            <div className="relative flex items-center gap-2">
                {theme === 'dark' ? (
                    <>
                        <Sun className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium text-slate-200">Light Mode</span>
                    </>
                ) : (
                    <>
                        <Moon className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-700">Dark Mode</span>
                    </>
                )}
            </div>
        </Button>
    )
}
