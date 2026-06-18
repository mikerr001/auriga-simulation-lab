import { useListObservations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function Observatory() {
  const { data: observations, isLoading } = useListObservations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">OBSERVATORY</h1>
          <p className="text-muted-foreground mt-1">Log of failures, anomalies, and research debt</p>
        </div>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SEVERITY</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">TYPE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">TITLE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SUBSYSTEM</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground text-right">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : observations?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No observations logged.
                  </TableCell>
                </TableRow>
              ) : (
                observations?.map((o) => (
                  <TableRow key={o.id} className="border-border/50 hover:bg-secondary/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{o.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-[10px] ${o.severity === 'critical' ? 'text-destructive border-destructive/50' : o.severity === 'high' ? 'text-orange-500 border-orange-500/50' : 'text-muted-foreground'}`}>
                        {o.severity}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[10px] bg-secondary/20">{o.type}</Badge></TableCell>
                    <TableCell className="font-medium text-foreground">{o.title}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{o.subsystem || 'unknown'}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={`font-mono text-[10px] ${o.resolved ? 'text-primary border-primary/50 bg-primary/10' : 'text-muted-foreground'}`}>
                        {o.resolved ? 'RESOLVED' : 'OPEN'}
                      </Badge>
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
