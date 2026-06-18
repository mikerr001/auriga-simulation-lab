import { useListScenarios, getListScenariosQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Scenarios() {
  const { data: scenarios, isLoading } = useListScenarios({}, {
    query: { queryKey: getListScenariosQueryKey({}) }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-foreground flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            Scenario Database
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">Environment & Agent configurations</p>
        </div>
        <Button variant="outline" className="rounded-none border-primary text-primary hover:bg-primary/20 uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </header>

      {isLoading ? (
        <div className="text-primary font-mono animate-pulse">QUERYING SCENARIO ARCHIVE...</div>
      ) : (
        <div className="border border-border bg-card/50 backdrop-blur">
          <Table>
            <TableHeader className="bg-muted/20 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">ID</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">Name</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">Environment</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">User Type</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">Difficulty</TableHead>
                <TableHead className="uppercase tracking-widest text-xs font-semibold text-muted-foreground">Hazards</TableHead>
                <TableHead className="text-right uppercase tracking-widest text-xs font-semibold text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios?.map((s) => (
                <TableRow key={s.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">#{s.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-none uppercase tracking-wider text-[10px] border-border bg-black/40">
                      {s.environment_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-none uppercase tracking-wider text-[10px] border-border bg-black/40 text-primary">
                      {s.user_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none uppercase tracking-wider text-[10px] border-border bg-black/40 ${s.difficulty === 'hard' || s.difficulty === 'adversarial' ? 'text-destructive border-destructive/30' : 'text-foreground'}`}>
                      {s.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {s.hazard_density}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="rounded-none text-xs uppercase tracking-widest h-8 text-muted-foreground hover:text-primary">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!scenarios?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground uppercase tracking-widest text-sm">
                    No scenarios found in archive
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
