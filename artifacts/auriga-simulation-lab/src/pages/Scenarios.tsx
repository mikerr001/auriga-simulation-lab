import { useListScenarios, useDeleteScenario } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Box, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListScenariosQueryKey } from "@workspace/api-client-react";

export default function Scenarios() {
  const { data: scenarios, isLoading } = useListScenarios();
  const deleteScenario = useDeleteScenario();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (!confirm("Delete scenario?")) return;
    deleteScenario.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Scenario deleted" });
        queryClient.invalidateQueries({ queryKey: getListScenariosQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">SCENARIOS</h1>
          <p className="text-muted-foreground mt-1">Manage simulation environments and hazard conditions</p>
        </div>
        <Button className="font-mono text-sm" asChild>
          <Link href="/scenarios/new">
            <Plus className="w-4 h-4 mr-2" /> CREATE
          </Link>
        </Button>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">NAME</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">ENV TYPE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">DIFFICULTY</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">HAZARD DENSITY</TableHead>
                <TableHead className="text-right font-mono text-xs text-muted-foreground">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : scenarios?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No scenarios found.
                  </TableCell>
                </TableRow>
              ) : (
                scenarios?.map((s) => (
                  <TableRow key={s.id} className="border-border/50 hover:bg-secondary/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">#{s.id}</TableCell>
                    <TableCell className="font-medium text-primary">
                      <Link href={`/scenarios/${s.id}`} className="hover:underline">{s.name}</Link>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[10px] bg-secondary/20">{s.environment_type}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`font-mono text-[10px] ${s.difficulty === 'hard' || s.difficulty === 'adversarial' ? 'text-destructive border-destructive/50' : 'text-muted-foreground'}`}>{s.difficulty}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[10px]">{s.hazard_density}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
