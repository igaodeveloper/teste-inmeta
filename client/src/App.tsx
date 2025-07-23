import { useEffect } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { AuthGuard } from '@/components/auth/auth-guard';
import Home from "@/pages/home";
import Cards from "@/pages/cards";
import MyCards from "@/pages/my-cards";
import Trades from "@/pages/trades";
import NotFound from "@/pages/not-found";

// Initialize theme on app load
function ThemeInitializer() {
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    // Check for system preference if no theme is set
    if (isDark === undefined) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark);
    } else if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, [isDark, setTheme]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cards" component={Cards} />
      <Route path="/my-cards">
        <AuthGuard>
          <MyCards />
        </AuthGuard>
      </Route>
      <Route path="/trades">
        <AuthGuard>
          <Trades />
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInitializer />
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Router />
          <MobileNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
