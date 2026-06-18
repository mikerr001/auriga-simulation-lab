import React from "react";
import { useListScenarios, getListScenariosQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Scenarios() {
  const { data: scenarios, isLoading } = useListScenarios();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Library</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Manage and launch test scenarios</p>
        </div>
        <Link href="/scenarios/new">
          <Button className="font-mono text-xs"><Plus className="w-4 h-4 mr-2" /> New Scenario</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenarios?.map((scenario) => (
             <Card key={scenario.id} className="hover:border-primary/50 transition-colors">
               <CardHeader>
                 <CardTitle className="flex justify-between items-start">
                   <Link href={`/scenarios/${scenario.id}`} className="hover:underline">{scenario.name}</Link>
                 </CardTitle>
                 <CardDescription className="font-mono text-xs">{scenario.environment_type} | {scenario.difficulty}</CardDescription>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden line-clamp-2">{scenario.description}</p>
                 <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                   <span>{format(new Date(scenario.created_at), 'MMM dd, yyyy')}</span>
                   <Link href={`/scenarios/${scenario.id}`}>
                     <Button variant="outline" size="sm" className="h-8">Details</Button>
                   </Link>
                 </div>
               </CardContent>
             </Card>
          ))}
          {scenarios?.length === 0 && (
            <div className="col-span-full py-12 text-center border rounded-md border-dashed">
              <Database className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Scenarios</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first scenario to begin testing.</p>
              <Link href="/scenarios/new">
                <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Create Scenario</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
