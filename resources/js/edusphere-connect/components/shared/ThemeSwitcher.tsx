import React from 'react';
import { useTheme, ThemeColor, ThemeMode } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODE_OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeSwitcher() {
  const { themeColor, themeMode, setThemeColor, setThemeMode, themes, isDark } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span 
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
            style={{ backgroundColor: themes.find(t => t.value === themeColor)?.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mode Selection */}
        <div className="flex gap-1 p-2">
          {MODE_OPTIONS.map((mode) => (
            <Button
              key={mode.value}
              variant={themeMode === mode.value ? "default" : "outline"}
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => setThemeMode(mode.value)}
            >
              {mode.icon}
              <span className="text-xs">{mode.label}</span>
            </Button>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Color Theme</DropdownMenuLabel>
        
        <div className="grid grid-cols-5 gap-1.5 p-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setThemeColor(t.value)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                themeColor === t.value 
                  ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background" 
                  : "border-transparent hover:border-muted-foreground/50"
              )}
              style={{ backgroundColor: t.color }}
              title={t.label}
            />
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium">{themes.find(t => t.value === themeColor)?.label}</p>
          <p className="text-xs text-muted-foreground">
            {themeMode === 'system' ? 'Following system' : themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
