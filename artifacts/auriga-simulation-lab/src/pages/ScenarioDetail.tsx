import { useGetScenario, useListSimulations, useCreateSimulation, getGetScenarioQueryKey, getListScenariosQueryKey, getListSimulationsQueryKey } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ScenarioDetail() {
  const [, params] = useRoute("/scenarios/:id");
  const id = parseInt(params?.id ?? "0", 10);
  const { data: scenario, isLoading } = useGetScenario(id, { query: { enabled: !!id, queryKey: getGetScenarioQueryKey(id) } });
  const { data: simulations } = useListSimulations({ scenario_id: id }, { query: { enabled: !!id, queryKey: getListSimulationsQueryKey({ scenario_id: id }) } });
  const createSimulation = useCreateSimulation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRunSimulation = (mode: string) => {
    createSimulation.mutate({ data: { scenario_id: id, scale: 1000, mode } }, {
      onSuccess: () => {
        toast({ title: "Simulation launched", description: `${mode} mode — 1,000 test cases` });
        queryClient.invalidateQueries({ queryKey: getListSimulationsQueryKey() });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="font-mono">Scenario not found</p>
        <Link href="/scenarios" className="text-primary text-sm mt-2 block hover:underline">Return to Scenarios</Link>
      </div>
    );
  }

  const fields = [
    { label: "Environment Type", value: scenario.environment_type },
    { label: "User Type", value: scenario.user_type },
    { label: "Movement Speed", value: scenario.movement_speed },
    { label: "Difficulty", value: scenario.difficulty },
    { label: "Hazard Density", value: scenario.hazard_density },
    { label: "Sensor Noise", value: scenario.sensor_noise_level },
    { label: "Lighting", value: scenario.lighting_condition },
    { label: "Obstacle Count", value: scenario.obstacle_count?.toString() ?? "—" },
    { label: "Dynamic Obstacles", value: scenario.dynamic_obstacles ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
          <Link href="/scenarios"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">{scenario.name}</h1>
          {scenario.description && <p className="text-sm text-muted-foreground mt-0.5">{scenario.description}</p>}
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="font-mono text-xs" onClick={() => handleRunSimulation("standard")} disabled={createSimulation.isPending}>
            <Play className="h-3 w-3 mr-1" /> STANDARD
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-xs border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => handleRunSimulation("adversarial")} disabled={createSimulation.isPending}>
            <Play className="h-3 w-3 mr-1" /> ADVERSARIAL
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {fields.map(({ label, value }) => (
          <Card key={label} className="bg-card/50 border-border">
            <CardContent className="p-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
              <p className="text-sm font-mono mt-1 text-foreground capitalize">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(scenario.hazard_types ?? []).length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">HAZARD TYPES</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(scenario.hazard_types ?? []).map((h) => (
              <Badge key={h} variant="outline" className="font-mono text-[10px] bg-destructive/10 border-destructive/30 text-destructive">{h}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/50 border-border">
        <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">SIMULATION RUNS</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-muted-foreground">ID</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">MODE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">SCALE</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground">STATUS</TableHead>
                <TableHead className="font-mono text-xs text-muted-foreground text-right">SUCCESS RATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!simulations || simulations.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-sm">No simulation runs yet.</TableCell></TableRow>
              ) : (
                simulations.map((s) => (
                  <TableRow key={s.id} className="border-border/50 hover:bg-secondary/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <Link href={`/simulations/${s.id}`} className="text-primary hover:underline">#{s.id}</Link>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="font-mono text-[10px]">{s.mode || "standard"}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{s.scale?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-mono text-[10px] ${s.status === "completed" ? "text-primary border-primary/50" : "text-muted-foreground"}`}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {s.success_rate != null ? `${Number(s.success_rate).toFixed(1)}%` : "—"}
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
