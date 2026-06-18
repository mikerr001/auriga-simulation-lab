import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetDashboardActivity, getGetDashboardActivityQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, ShieldCheck, Zap, ActivitySquare, Crosshair } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  const { data: activity, isLoading: loadingActivity } = useGetDashboardActivity(
    { limit: 10 },
    { query: { queryKey: getGetDashboardActivityQueryKey({ limit: 10 }) } }
  );

  if (loadingSummary || loadingActivity) {
    return <div className="text-primary font-mono animate-pulse">INITIATING TELEMETRY...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-foreground flex items-center gap-3">
            <ActivitySquare className="w-6 h-6 text-primary" />
            Global Telemetry
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">System Overview & Aggregate Metrics</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground uppercase tracking-widest">System Time</div>
          <div className="text-xl font-mono text-primary">{new Date().toISOString()}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tests Executed" value={summary?.total_tests_run?.toLocaleString() ?? "0"} icon={Zap} />
        <StatCard title="Active Sims" value={summary?.active_simulations?.toString() ?? "0"} icon={Activity} highlight={!!summary?.active_simulations} />
        <StatCard title="Success Rate" value={`${summary?.overall_success_rate?.toFixed(2)}%`} icon={ShieldCheck} />
        <StatCard title="Crit. Observations" value={summary?.critical_observations?.toString() ?? "0"} icon={AlertTriangle} warning={!!summary?.critical_observations} />
        <StatCard title="Hazard Detection" value={`${summary?.overall_hazard_detection_rate?.toFixed(2)}%`} icon={Crosshair} />
        <StatCard title="False Positives" value={`${summary?.overall_false_positive_rate?.toFixed(2)}%`} />
        <StatCard title="False Negatives" value={`${summary?.overall_false_negative_rate?.toFixed(2)}%`} />
        <StatCard title="Avg Latency" value={`${summary?.avg_latency_ms?.toFixed(1)}ms`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="col-span-2 border-border bg-card/50 backdrop-blur">
          <CardHeader className="border-b border-border bg-muted/20">
            <CardTitle className="text-sm tracking-widest uppercase text-muted-foreground">Recent Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {activity?.map((entry) => (
                <div key={entry.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="text-xs text-muted-foreground w-32 shrink-0">{new Date(entry.created_at).toLocaleTimeString()}</div>
                  <Badge variant="outline" className="uppercase font-mono text-[10px] tracking-wider w-24 justify-center rounded-none border-primary/30 text-primary bg-primary/10">
                    {entry.action}
                  </Badge>
                  <div className="text-sm flex-1">
                    <span className="text-foreground">{entry.entity_type}</span>
                    <span className="text-muted-foreground mx-2">/</span>
                    <span className="text-primary">{entry.entity_name || entry.entity_id}</span>
                  </div>
                </div>
              ))}
              {!activity?.length && (
                <div className="p-8 text-center text-muted-foreground uppercase text-sm tracking-widest">No recent activity detected</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="border-b border-border bg-muted/20">
            <CardTitle className="text-sm tracking-widest uppercase text-muted-foreground">Subsystem Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="uppercase text-sm tracking-wider">Total Scenarios</span>
              <span className="font-mono text-primary">{summary?.total_scenarios}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="uppercase text-sm tracking-wider">Total Simulations</span>
              <span className="font-mono text-primary">{summary?.total_simulations}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <span className="uppercase text-sm tracking-wider">Total Benchmarks</span>
              <span className="font-mono text-primary">{summary?.total_benchmarks}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="uppercase text-sm tracking-wider">Weaknesses Found</span>
              <span className="font-mono text-destructive">{summary?.total_weaknesses_found}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight, warning }: { title: string, value: string, icon?: any, highlight?: boolean, warning?: boolean }) {
  return (
    <Card className={`border-border bg-card/50 backdrop-blur ${highlight ? 'border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : ''} ${warning ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
          {Icon && <Icon className={`w-4 h-4 ${warning ? 'text-destructive' : 'text-primary'}`} />}
        </div>
        <div className={`text-3xl font-mono ${warning ? 'text-destructive' : 'text-foreground'}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
