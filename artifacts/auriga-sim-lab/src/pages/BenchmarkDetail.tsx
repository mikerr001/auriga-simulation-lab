import React from "react";
import { useGetBenchmark, getGetBenchmarkQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function BenchmarkDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: benchmark, isLoading } = useGetBenchmark(id, {
    query: {
      enabled: !!id,
      queryKey: getGetBenchmarkQueryKey(id)
    }
  });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" /></div>;
  if (!benchmark) return <div>Benchmark not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/benchmarks" className="text-xs text-muted-foreground hover:text-primary font-mono flex items-center mb-4"><ArrowLeft className="w-3 h-3 mr-1"/> Back to Benchmarks</Link>
        <h1 className="text-3xl font-bold tracking-tight">{benchmark.name || `Benchmark #${benchmark.id}`}</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">Suite: {benchmark.suite}</p>
      </div>
    </div>
  );
}
