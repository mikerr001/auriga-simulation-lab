import { useCreateScenario, getListScenariosQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ScenarioNew() {
  const [, navigate] = useLocation();
  const createScenario = useCreateScenario();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    environment_type: "corridor",
    user_type: "blind",
    movement_speed: "normal",
    difficulty: "medium",
    hazard_density: "medium",
    sensor_noise_level: "low",
    lighting_condition: "normal",
    dynamic_obstacles: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createScenario.mutate({ data: form }, {
      onSuccess: (scenario) => {
        toast({ title: "Scenario created", description: scenario.name });
        queryClient.invalidateQueries({ queryKey: getListScenariosQueryKey() });
        navigate(`/scenarios/${scenario.id}`);
      },
      onError: () => toast({ title: "Failed to create scenario", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
          <Link href="/scenarios"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight">NEW SCENARIO</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure a simulation environment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">IDENTITY</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs">NAME</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Scenario name" required className="font-mono text-sm bg-secondary/30 border-border" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-xs">DESCRIPTION</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" className="font-mono text-sm bg-secondary/30 border-border" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader><CardTitle className="text-xs font-mono text-muted-foreground">ENVIRONMENT</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[
              { key: "environment_type", label: "ENV TYPE", options: ["corridor", "room", "intersection", "stairs", "ramp", "elevator", "outdoor", "mixed"] },
              { key: "user_type", label: "USER TYPE", options: ["walking", "blind", "mobility_impaired", "mixed"] },
              { key: "movement_speed", label: "SPEED", options: ["slow", "normal", "fast"] },
              { key: "difficulty", label: "DIFFICULTY", options: ["easy", "medium", "hard", "adversarial"] },
              { key: "hazard_density", label: "HAZARD DENSITY", options: ["none", "low", "medium", "high", "extreme"] },
              { key: "sensor_noise_level", label: "SENSOR NOISE", options: ["none", "low", "medium", "high"] },
              { key: "lighting_condition", label: "LIGHTING", options: ["bright", "normal", "dim", "dark", "flickering"] },
            ].map(({ key, label, options }) => (
              <div key={key} className="space-y-1.5">
                <Label className="font-mono text-xs">{label}</Label>
                <Select value={String((form as Record<string, unknown>)[key])} onValueChange={(v) => setForm({ ...form, [key]: v })}>
                  <SelectTrigger className="font-mono text-xs bg-secondary/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((o) => (
                      <SelectItem key={o} value={o} className="font-mono text-xs">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="font-mono text-xs">DYNAMIC OBSTACLES</Label>
              <Select value={form.dynamic_obstacles ? "yes" : "no"} onValueChange={(v) => setForm({ ...form, dynamic_obstacles: v === "yes" })}>
                <SelectTrigger className="font-mono text-xs bg-secondary/30 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no" className="font-mono text-xs">No</SelectItem>
                  <SelectItem value="yes" className="font-mono text-xs">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" asChild className="font-mono text-xs"><Link href="/scenarios">CANCEL</Link></Button>
          <Button type="submit" disabled={createScenario.isPending || !form.name} className="font-mono text-xs">
            {createScenario.isPending ? "CREATING..." : "CREATE SCENARIO"}
          </Button>
        </div>
      </form>
    </div>
  );
}
