import { useListBenchmarks } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function Benchmarks() {
  const { data: benchmarks, isLoading } = useListBenchmarks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">BENCHMARKS</h1>
          <p className="text-muted-foreground mt-1">Aggregated suite performance metrics</p>
        </div>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SUITE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">STATUS</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SCENARIOS</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SUCCESS RATE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground text-right">LATENCY (AVG)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : benchmarks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No benchmarks found.
                  </TableCell>
                </TableRow>
              ) : (
                benchmarks?.map((b) => (
                  <TableRow key={b.id} className="border-border/50 hover:bg-secondary/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{b.id}</TableCell>
                    <TableCell className="font-medium text-primary">
                      <Link href={`/benchmarks/${b.id}`} className="hover:underline">{b.name || b.suite}</Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-[10px] ${b.status === 'completed' ? 'text-primary border-primary/50' : 'text-muted-foreground'}`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{b.scenario_count ?? '-'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {b.success_rate != null ? `${Number(b.success_rate).toFixed(1)}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {b.avg_latency_ms != null ? `${b.avg_latency_ms.toFixed(1)}ms` : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
