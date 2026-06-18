import React from "react";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey()
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Dashboard</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">Auriga Navigation System Status Overview</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : summary ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono uppercase">Overall Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{(summary.overall_success_rate * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Across {summary.total_tests_run} tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono uppercase">Active Simulations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{summary.active_simulations}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>
          <Card className={summary.critical_observations > 0 ? "border-destructive/50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono uppercase">Open Observations</CardTitle>
              <AlertTriangle className={summary.critical_observations > 0 ? "h-4 w-4 text-destructive" : "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{summary.open_observations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.critical_observations} critical
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-mono uppercase">Weaknesses Found</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{summary.total_weaknesses_found}</div>
              <p className="text-xs text-muted-foreground mt-1">In adversarial tests</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
