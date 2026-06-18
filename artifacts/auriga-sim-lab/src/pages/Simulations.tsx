import React from "react";
import { useListSimulations } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Simulations() {
  const { data: simulations, isLoading } = useListSimulations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulations</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">View simulation runs</p>
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
                <TableHead className="font-mono text-xs uppercase">Scenario</TableHead>
                <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase">Mode</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Success Rate</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Started</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulations?.map((sim) => (
                <TableRow key={sim.id}>
                  <TableCell className="font-mono text-xs">#{sim.id}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/scenarios/${sim.scenario_id}`} className="hover:underline">{sim.scenario_name || `Scenario ${sim.scenario_id}`}</Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sim.status === 'completed' ? 'default' : sim.status === 'failed' ? 'destructive' : 'outline'}>
                      {sim.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{sim.mode}</TableCell>
                  <TableCell className="font-mono text-xs text-right">
                    {sim.success_rate !== null && sim.success_rate !== undefined ? `${(sim.success_rate * 100).toFixed(1)}%` : '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-right text-muted-foreground">
                    {sim.started_at ? format(new Date(sim.started_at), 'MMM dd, HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/simulations/${sim.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 font-mono text-xs">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {simulations?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground font-mono">No simulations found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
