import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Scenarios from "@/pages/Scenarios";
import ScenarioDetail from "@/pages/ScenarioDetail";
import ScenarioNew from "@/pages/ScenarioNew";
import Simulations from "@/pages/Simulations";
import SimulationDetail from "@/pages/SimulationDetail";
import Benchmarks from "@/pages/Benchmarks";
import BenchmarkDetail from "@/pages/BenchmarkDetail";
import Observatory from "@/pages/Observatory";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scenarios/new" component={ScenarioNew} />
        <Route path="/scenarios/:id" component={ScenarioDetail} />
        <Route path="/scenarios" component={Scenarios} />
        <Route path="/simulations/:id" component={SimulationDetail} />
        <Route path="/simulations" component={Simulations} />
        <Route path="/benchmarks/:id" component={BenchmarkDetail} />
        <Route path="/benchmarks" component={Benchmarks} />
        <Route path="/observatory" component={Observatory} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
