import React from "react";
import { useListBenchmarks } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Benchmarks() {
  const { data: benchmarks, isLoading } = useListBenchmarks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benchmark Suite</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Aggregate test results</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="border border-border rounded-md bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase">ID</TableHead>
                <TableHead className="font-mono text-xs uppercase">Name</TableHead>
                <TableHead className="font-mono text-xs uppercase">Suite</TableHead>
                <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">#{b.id}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/benchmarks/${b.id}`} className="hover:underline">{b.name || `Benchmark ${b.id}`}</Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{b.suite}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{b.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-right">
                    {b.success_rate !== null && b.success_rate !== undefined ? `${(b.success_rate * 100).toFixed(1)}%` : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {benchmarks?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-mono">No benchmarks found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
