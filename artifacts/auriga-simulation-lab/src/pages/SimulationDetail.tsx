import { useGetSimulation, getGetSimulationQueryKey } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

function MetricCard({ label, value, highlight }: { label: string; value: string | number | null | undefined; highlight?: "good" | "warn" | "bad" }) {
  const color = highlight === "good" ? "text-primary" : highlight === "warn" ? "text-yellow-400" : highlight === "bad" ? "text-destructive" : "text-foreground";
  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-mono font-bold mt-1 ${color}`}>{value ?? "—"}</p>
      </CardContent>
    </Card>
  );
}

export default function SimulationDetail() {
  const [, params] = useRoute("/simulations/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { data: sim, isLoading } = useGetSimulation(id, { query: { enabled: !!id, queryKey: getGetSimulationQueryKey(id) } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="font-mono">Simulation not found</p>
        <Link href="/simulations" className="text-primary text-sm mt-2 block hover:underline">Return to Simulations</Link>
      </div>
    );
  }

  const sr = sim.success_rate != null ? Number(sim.success_rate) : null;
  const hdr = sim.hazard_detection_rate != null ? Number(sim.hazard_detection_rate) : null;
  const fpr = sim.false_positive_rate != null ? Number(sim.false_positive_rate) : null;
  const fnr = sim.false_negative_rate != null ? Number(sim.false_negative_rate) : null;
  const dss = sim.decision_stability_score != null ? Number(sim.decision_stability_score) : null;
  const lat = sim.avg_latency_ms != null ? Number(sim.avg_latency_ms) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
          <Link href="/simulations"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">
            SIMULATION #{sim.id}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Scenario: <Link href={`/scenarios/${sim.scenario_id}`} className="text-primary hover:underline">{sim.scenario_name || `#${sim.scenario_id}`}</Link>
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className={`font-mono text-xs ${sim.status === "completed" ? "text-primary border-primary/50" : sim.status === "failed" ? "text-destructive border-destructive/50" : "text-muted-foreground"}`}>
            {sim.status?.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs bg-secondary/20">{sim.mode?.toUpperCase() || "STANDARD"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Success Rate" value={sr != null ? `${sr.toFixed(1)}%` : null} highlight={sr != null ? (sr >= 85 ? "good" : sr >= 70 ? "warn" : "bad") : undefined} />
        <MetricCard label="Hazard Detection" value={hdr != null ? `${hdr.toFixed(1)}%` : null} highlight={hdr != null ? (hdr >= 85 ? "good" : hdr >= 75 ? "warn" : "bad") : undefined} />
        <MetricCard label="False Positive Rate" value={fpr != null ? `${fpr.toFixed(1)}%` : null} highlight={fpr != null ? (fpr <= 5 ? "good" : fpr <= 10 ? "warn" : "bad") : undefined} />
        <MetricCard label="False Negative Rate" value={fnr != null ? `${fnr.toFixed(1)}%` : null} highlight={fnr != null ? (fnr <= 5 ? "good" : fnr <= 10 ? "warn" : "bad") : undefined} />
        <MetricCard label="Decision Stability" value={dss != null ? `${dss.toFixed(1)}` : null} highlight={dss != null ? (dss >= 85 ? "good" : dss >= 70 ? "warn" : "bad") : undefined} />
        <MetricCard label="Avg Latency" value={lat != null ? `${lat.toFixed(1)}ms` : null} highlight={lat != null ? (lat <= 50 ? "good" : lat <= 80 ? "warn" : "bad") : undefined} />
        <MetricCard label="Total Tests" value={sim.total_tests?.toLocaleString()} />
        <MetricCard label="Scale" value={sim.scale?.toLocaleString()} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">TEST RESULTS</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Passed</span>
              <span className="text-sm font-mono text-primary">{sim.passed_tests?.toLocaleString() ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Failed</span>
              <span className="text-sm font-mono text-destructive">{sim.failed_tests?.toLocaleString() ?? "—"}</span>
            </div>
            {sim.total_tests != null && sim.passed_tests != null && (
              <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${(sim.passed_tests / sim.total_tests) * 100}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">TIMELINE</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Created</span>
              <span className="text-xs font-mono">{new Date(sim.created_at).toLocaleString()}</span>
            </div>
            {sim.started_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">Started</span>
                <span className="text-xs font-mono">{new Date(sim.started_at).toLocaleString()}</span>
              </div>
            )}
            {sim.completed_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">Completed</span>
                <span className="text-xs font-mono">{new Date(sim.completed_at).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {sim.notes && (
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">NOTES</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{sim.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
