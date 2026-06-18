import { useGetBenchmark, getGetBenchmarkQueryKey } from "@workspace/api-client-react";
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

export default function BenchmarkDetail() {
  const [, params] = useRoute("/benchmarks/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { data: b, isLoading } = useGetBenchmark(id, { query: { enabled: !!id, queryKey: getGetBenchmarkQueryKey(id) } });

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

  if (!b) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="font-mono">Benchmark not found</p>
        <Link href="/benchmarks" className="text-primary text-sm mt-2 block hover:underline">Return to Benchmarks</Link>
      </div>
    );
  }

  const sr = b.success_rate != null ? Number(b.success_rate) : null;
  const hdr = b.hazard_detection_rate != null ? Number(b.hazard_detection_rate) : null;
  const fpr = b.false_positive_rate != null ? Number(b.false_positive_rate) : null;
  const fnr = b.false_negative_rate != null ? Number(b.false_negative_rate) : null;
  const dss = b.decision_stability_score != null ? Number(b.decision_stability_score) : null;
  const lat = b.avg_latency_ms != null ? Number(b.avg_latency_ms) : null;
  const ccs = b.confidence_calibration_score != null ? Number(b.confidence_calibration_score) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
          <Link href="/benchmarks"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">{b.name || b.suite}</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">{b.suite?.toUpperCase().replace(/_/g, " ")}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline" className={`font-mono text-xs ${b.status === "completed" ? "text-primary border-primary/50" : "text-muted-foreground"}`}>
            {b.status?.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Success Rate" value={sr != null ? `${sr.toFixed(1)}%` : null} highlight={sr != null ? (sr >= 85 ? "good" : sr >= 70 ? "warn" : "bad") : undefined} />
        <MetricCard label="Hazard Detection" value={hdr != null ? `${hdr.toFixed(1)}%` : null} highlight={hdr != null ? (hdr >= 85 ? "good" : hdr >= 75 ? "warn" : "bad") : undefined} />
        <MetricCard label="False Positive Rate" value={fpr != null ? `${fpr.toFixed(1)}%` : null} highlight={fpr != null ? (fpr <= 5 ? "good" : fpr <= 10 ? "warn" : "bad") : undefined} />
        <MetricCard label="False Negative Rate" value={fnr != null ? `${fnr.toFixed(1)}%` : null} highlight={fnr != null ? (fnr <= 5 ? "good" : fnr <= 10 ? "warn" : "bad") : undefined} />
        <MetricCard label="Decision Stability" value={dss != null ? `${dss.toFixed(1)}` : null} highlight={dss != null ? (dss >= 85 ? "good" : dss >= 70 ? "warn" : "bad") : undefined} />
        <MetricCard label="Avg Latency" value={lat != null ? `${lat.toFixed(1)}ms` : null} highlight={lat != null ? (lat <= 50 ? "good" : lat <= 80 ? "warn" : "bad") : undefined} />
        <MetricCard label="Confidence Calibration" value={ccs != null ? `${ccs.toFixed(1)}` : null} />
        <MetricCard label="Weaknesses Found" value={b.weaknesses_found} highlight={b.weaknesses_found != null ? (b.weaknesses_found === 0 ? "good" : b.weaknesses_found <= 5 ? "warn" : "bad") : undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">LATENCY RANGE</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Min</span>
              <span className="text-sm font-mono text-primary">{b.min_latency_ms != null ? `${Number(b.min_latency_ms).toFixed(1)}ms` : "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Avg</span>
              <span className="text-sm font-mono">{lat != null ? `${lat.toFixed(1)}ms` : "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Max</span>
              <span className="text-sm font-mono text-destructive">{b.max_latency_ms != null ? `${Number(b.max_latency_ms).toFixed(1)}ms` : "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">TIMELINE</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Scenarios</span>
              <span className="text-sm font-mono">{b.scenario_count?.toLocaleString() ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-mono">Created</span>
              <span className="text-xs font-mono">{new Date(b.created_at).toLocaleString()}</span>
            </div>
            {b.completed_at && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">Completed</span>
                <span className="text-xs font-mono">{new Date(b.completed_at).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
