import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full h-10 w-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-transparent hover:border-[1px] hover:border-slate-400 dark:hover:border-slate-500 active:border-[1px] active:border-slate-600 dark:active:border-slate-400 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
