import { useGetDashboardSummary, useGetDashboardActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Box, TerminalSquare, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: isActivityLoading } = useGetDashboardActivity();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">DASHBOARD</h1>
          <p className="text-muted-foreground mt-1">System-wide performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Scenarios" 
          value={summary?.total_scenarios} 
          loading={isSummaryLoading} 
          icon={<Box className="w-4 h-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Active Simulations" 
          value={summary?.active_simulations} 
          loading={isSummaryLoading} 
          icon={<TerminalSquare className="w-4 h-4 text-primary" />} 
        />
        <StatCard 
          title="Success Rate" 
          value={summary ? `${summary.overall_success_rate.toFixed(1)}%` : undefined} 
          loading={isSummaryLoading} 
          icon={<Activity className="w-4 h-4 text-muted-foreground" />} 
        />
        <StatCard 
          title="Critical Observations" 
          value={summary?.critical_observations} 
          loading={isSummaryLoading} 
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-muted-foreground">RECENT ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              {isActivityLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-secondary/50" />
                  <Skeleton className="h-12 w-full bg-secondary/50" />
                  <Skeleton className="h-12 w-full bg-secondary/50" />
                </div>
              ) : activity?.length ? (
                <div className="space-y-4">
                  {activity.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-4 p-3 rounded-md bg-secondary/30 border border-border/50">
                      <div className="mt-1">
                        {entry.entity_type === 'simulation' ? <TerminalSquare className="w-4 h-4 text-primary" /> : 
                         entry.entity_type === 'scenario' ? <Box className="w-4 h-4 text-accent" /> :
                         <Activity className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold uppercase">{entry.action}</span>
                          <span className="text-sm text-muted-foreground">{entry.entity_name || `${entry.entity_type} #${entry.entity_id}`}</span>
                        </div>
                        <div className="text-xs text-muted-foreground/70 mt-1 font-mono">
                          {new Date(entry.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline" className="font-mono text-[10px]">{entry.entity_type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">No recent activity found.</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-muted-foreground">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/scenarios" className="block w-full text-center py-2 px-4 rounded border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono text-sm">
                NEW SCENARIO
              </Link>
              <Link href="/simulations" className="block w-full text-center py-2 px-4 rounded border border-border hover:bg-secondary transition-colors font-mono text-sm">
                RUN SIMULATION
              </Link>
              <Link href="/benchmarks" className="block w-full text-center py-2 px-4 rounded border border-border hover:bg-secondary transition-colors font-mono text-sm">
                VIEW BENCHMARKS
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, icon }: { title: string, value?: string | number, loading: boolean, icon: React.ReactNode }) {
  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground uppercase">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-secondary" />
            ) : (
              <p className="text-2xl font-bold font-mono text-foreground">{value ?? '-'}</p>
            )}
          </div>
          <div className="p-2 bg-secondary rounded-md">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
