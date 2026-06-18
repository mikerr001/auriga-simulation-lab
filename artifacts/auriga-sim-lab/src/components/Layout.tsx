import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, Play, BarChart3, Eye, ShieldAlert, Zap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Scenario Library", href: "/scenarios", icon: Database },
    { name: "Simulation Runs", href: "/simulations", icon: Play },
    { name: "Benchmark Suite", href: "/benchmarks", icon: BarChart3 },
    { name: "Observatory", href: "/observatory", icon: Eye },
    { name: "Adversarial Testing", href: "/adversarial", icon: ShieldAlert },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <Sidebar className="border-r border-border bg-sidebar">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-primary">PROJECT AURIGA</span>
                <span className="text-[10px] uppercase text-muted-foreground font-mono">Simulation Lab</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase font-mono tracking-widest text-muted-foreground mb-2">Command Center</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-6 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
             <div className="flex-1"></div>
             <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               SYSTEM ONLINE
             </div>
          </header>
          <div className="p-6 md:p-8 flex-1 w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
