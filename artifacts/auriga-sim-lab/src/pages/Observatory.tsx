import React from "react";
import { useListObservations } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Observatory() {
  const { data: observations, isLoading } = useListObservations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Observatory</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Track unexpected behaviors</p>
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
                <TableHead className="font-mono text-xs uppercase">Severity</TableHead>
                <TableHead className="font-mono text-xs uppercase">Title</TableHead>
                <TableHead className="font-mono text-xs uppercase">Type</TableHead>
                <TableHead className="font-mono text-xs uppercase">Subsystem</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {observations?.map((obs) => (
                <TableRow key={obs.id}>
                  <TableCell className="font-mono text-xs">#{obs.id}</TableCell>
                  <TableCell>
                    <Badge variant={obs.severity === 'critical' ? 'destructive' : 'outline'}>{obs.severity}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{obs.title}</TableCell>
                  <TableCell className="font-mono text-xs">{obs.type}</TableCell>
                  <TableCell className="font-mono text-xs">{obs.subsystem}</TableCell>
                  <TableCell className="font-mono text-xs text-right text-muted-foreground">
                    {format(new Date(obs.created_at), 'MMM dd, HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
              {observations?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground font-mono">No observations logged.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
