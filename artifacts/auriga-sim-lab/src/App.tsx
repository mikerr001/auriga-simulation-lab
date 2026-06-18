import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Scenarios from "@/pages/Scenarios";
import ScenarioNew from "@/pages/ScenarioNew";
import ScenarioDetail from "@/pages/ScenarioDetail";
import Simulations from "@/pages/Simulations";
import SimulationDetail from "@/pages/SimulationDetail";
import Benchmarks from "@/pages/Benchmarks";
import BenchmarkDetail from "@/pages/BenchmarkDetail";
import Observatory from "@/pages/Observatory";
import Adversarial from "@/pages/Adversarial";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scenarios" component={Scenarios} />
        <Route path="/scenarios/new" component={ScenarioNew} />
        <Route path="/scenarios/:id" component={ScenarioDetail} />
        <Route path="/simulations" component={Simulations} />
        <Route path="/simulations/:id" component={SimulationDetail} />
        <Route path="/benchmarks" component={Benchmarks} />
        <Route path="/benchmarks/:id" component={BenchmarkDetail} />
        <Route path="/observatory" component={Observatory} />
        <Route path="/adversarial" component={Adversarial} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
