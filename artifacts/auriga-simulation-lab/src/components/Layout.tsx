import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Activity, 
  Box, 
  BarChart2, 
  Eye, 
  TerminalSquare
} from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Activity },
    { href: "/scenarios", label: "Scenarios", icon: Box },
    { href: "/simulations", label: "Simulations", icon: TerminalSquare },
    { href: "/benchmarks", label: "Benchmarks", icon: BarChart2 },
    { href: "/observatory", label: "Observatory", icon: Eye },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary tracking-tight font-mono">AURIGA</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Simulation Lab</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>SYS.ONLINE</span>
          </div>
          v1.0.4-rc2
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
