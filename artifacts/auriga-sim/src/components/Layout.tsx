import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, Database, PlaySquare, LineChart, Telescope } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scenarios", label: "Scenarios", icon: Database },
    { href: "/simulations", label: "Simulations", icon: PlaySquare },
    { href: "/benchmarks", label: "Benchmarks", icon: LineChart },
    { href: "/observatory", label: "Observatory", icon: Telescope },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground dark selection:bg-primary/30">
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-sm font-bold tracking-widest text-primary uppercase">AURIGA LAB</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mission Control</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors cursor-pointer border-l-2 ${active ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                  <Icon className="w-4 h-4" />
                  <span className="uppercase tracking-wider font-semibold">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-between">
            <span>System Status</span>
            <span className="text-emerald-500">ONLINE</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
