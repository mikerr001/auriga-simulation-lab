import React from "react";
import { useGetSimulation, getGetSimulationQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function SimulationDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: simulation, isLoading } = useGetSimulation(id, {
    query: {
      enabled: !!id,
      queryKey: getGetSimulationQueryKey(id)
    }
  });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" /></div>;
  if (!simulation) return <div>Simulation not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/simulations" className="text-xs text-muted-foreground hover:text-primary font-mono flex items-center mb-4"><ArrowLeft className="w-3 h-3 mr-1"/> Back to Simulations</Link>
        <h1 className="text-3xl font-bold tracking-tight">Run #{simulation.id}</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">Status: {simulation.status}</p>
      </div>
    </div>
  );
}
