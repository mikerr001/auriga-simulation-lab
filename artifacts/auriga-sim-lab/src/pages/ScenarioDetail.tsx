import React from "react";
import { useGetScenario, getGetScenarioQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ScenarioDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: scenario, isLoading } = useGetScenario(id, {
    query: {
      enabled: !!id,
      queryKey: getGetScenarioQueryKey(id)
    }
  });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" /></div>;
  if (!scenario) return <div>Scenario not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/scenarios" className="text-xs text-muted-foreground hover:text-primary font-mono flex items-center mb-4"><ArrowLeft className="w-3 h-3 mr-1"/> Back to Scenarios</Link>
        <h1 className="text-3xl font-bold tracking-tight">{scenario.name}</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">{scenario.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-border rounded-md p-6 bg-card">
          <h3 className="text-sm font-medium font-mono uppercase mb-4 text-primary">Parameters</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <dt className="text-muted-foreground">Environment</dt>
              <dd>{scenario.environment_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User Type</dt>
              <dd>{scenario.user_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd>{scenario.difficulty}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Hazard Density</dt>
              <dd>{scenario.hazard_density}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
