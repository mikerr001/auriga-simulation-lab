import { useListSimulations, useCreateSimulation, getListSimulationsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Simulations() {
  const { data: simulations, isLoading } = useListSimulations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">SIMULATIONS</h1>
          <p className="text-muted-foreground mt-1">Execution history and active runs</p>
        </div>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SCENARIO</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">STATUS</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">MODE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SCALE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground text-right">SUCCESS RATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : simulations?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No simulations found.
                  </TableCell>
                </TableRow>
              ) : (
                simulations?.map((s) => (
                  <TableRow key={s.id} className="border-border/50 hover:bg-secondary/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <Link href={`/simulations/${s.id}`} className="text-primary hover:underline">#{s.id}</Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/scenarios/${s.scenario_id}`} className="text-primary hover:underline">{s.scenario_name || `Scenario #${s.scenario_id}`}</Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-[10px] ${s.status === 'completed' ? 'text-primary border-primary/50' : s.status === 'failed' ? 'text-destructive border-destructive/50' : 'text-accent border-accent/50'}`}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[10px] bg-secondary/20">{s.mode || 'standard'}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{s.scale}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {s.success_rate != null ? `${Number(s.success_rate).toFixed(1)}%` : '-'}
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
