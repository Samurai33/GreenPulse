import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCard } from "@/components/ui/kpi-card";
import { PueGauge } from "@/components/charts/pue-gauge";
import { EnergyAreaChart } from "@/components/charts/energy-area-chart";
import { AlertsTable } from "@/components/alerts/alerts-table";
import { 
  Activity, 
  Zap, 
  Leaf, 
  Award, 
  Clock,
  TrendingUp,
  Server,
  DollarSign
} from "lucide-react";
import { 
  calculatePUE, 
  calculateCO2Avoided, 
  calculateCarbonCredits,
  formatKwh,
  formatCO2,
  formatPercentage
} from "@/lib/kpis";

interface EnergyData {
  ts: string;
  solar_kwh: number;
  grid_kwh: number;
  it_load_kwh: number;
  overhead_kwh: number;
}

interface SreMetrics {
  golden_signals: {
    latency_ms_p95: number[];
    error_rate_pct: number[];
    traffic_rps: number[];
    saturation: {
      cpu_pct: number[];
    };
  };
  uptime_30d: number;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  title: string;
  description: string;
  ts: string;
  acknowledged: boolean;
  actions: string[];
}

interface MarketplaceSummary {
  total_slots_available: number;
  total_slots_rented: number;
  utilization_pct: number;
  estimated_revenue_monthly: number;
}

export default function Dashboard() {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [sreMetrics, setSreMetrics] = useState<SreMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [marketplaceSummary, setMarketplaceSummary] = useState<MarketplaceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [energyRes, sreRes, alertsRes, marketplaceRes] = await Promise.all([
          fetch('/data/energy_timeseries.json'),
          fetch('/data/sre_metrics.json'),
          fetch('/data/alerts.json'),
          fetch('/data/marketplace.json')
        ]);

        const [energyData, sreData, alertsData, marketplaceData] = await Promise.all([
          energyRes.json(),
          sreRes.json(),
          alertsRes.json(),
          marketplaceRes.json()
        ]);

        setEnergyData(energyData.by_hour || []);
        setSreMetrics(sreData);
        setAlerts(alertsData);
        setMarketplaceSummary(marketplaceData.summary);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate current metrics
  const latestEnergy = energyData[energyData.length - 1];
  const currentPUE = latestEnergy ? calculatePUE(latestEnergy) : 0;
  
  // Calculate today's totals
  const todayTotals = energyData.reduce((acc, curr) => ({
    solar: acc.solar + curr.solar_kwh,
    grid: acc.grid + curr.grid_kwh,
    consumption: acc.consumption + curr.it_load_kwh + curr.overhead_kwh
  }), { solar: 0, grid: 0, consumption: 0 });

  const todayCO2Avoided = calculateCO2Avoided(todayTotals.solar, {
    solar_kg_per_kwh: 0.045,
    grid_kg_per_kwh: 0.4
  });

  const ytdCO2Avoided = todayCO2Avoided * 30; // Simulate YTD
  const carbonCredits = calculateCarbonCredits(ytdCO2Avoided);

  // Get latest SRE metrics
  const latestSre = sreMetrics?.golden_signals;
  const currentLatency = latestSre?.latency_ms_p95[latestSre.latency_ms_p95.length - 1] || 0;
  const currentErrors = latestSre?.error_rate_pct[latestSre.error_rate_pct.length - 1] || 0;
  const currentTraffic = latestSre?.traffic_rps[latestSre.traffic_rps.length - 1] || 0;
  const currentCPU = latestSre?.saturation.cpu_pct[latestSre.saturation.cpu_pct.length - 1] || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground">
            Dashboard principal do datacenter sustentável VoltEra
          </p>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title="Uptime 30d"
            value={formatPercentage(sreMetrics?.uptime_30d || 99.7)}
            subtitle="Disponibilidade do sistema"
            icon={Activity}
            status="success"
            trend={{ direction: 'up', value: '+0.2%' }}
            variant="compact"
          />
          
          <KpiCard
            title="PUE Atual"
            value={formatPUE(currentPUE)}
            subtitle={`Meta: ≤1.30`}
            icon={Zap}
            status={currentPUE <= 1.3 ? 'success' : 'warning'}
            trend={{ 
              direction: currentPUE <= 1.3 ? 'down' : 'up', 
              value: currentPUE <= 1.3 ? 'Boa' : 'Alta'
            }}
            variant="compact"
          />
          
          <KpiCard
            title="kWh Hoje"
            value={formatKwh(todayTotals.consumption)}
            subtitle="Consumo líquido total"
            icon={Zap}
            status="info"
            trend={{ direction: 'neutral', value: 'Estável' }}
            variant="compact"
          />
          
          <KpiCard
            title="CO₂ Evitado Hoje"
            value={formatCO2(todayCO2Avoided)}
            subtitle="Benefício ambiental"
            icon={Leaf}
            status="success"
            trend={{ direction: 'up', value: '+12%' }}
            variant="compact"
          />
          
          <KpiCard
            title="Créditos Estimados YTD"
            value={carbonCredits.toFixed(2)}
            subtitle="tCO₂e (não oficial)"
            icon={Award}
            status="info"
            trend={{ direction: 'up', value: '+5.2%' }}
            variant="compact"
          />
        </div>

        {/* Golden Signals Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Latência p95"
            value={`${currentLatency}ms`}
            subtitle="Tempo de resposta"
            icon={Clock}
            status={currentLatency <= 150 ? 'success' : 'warning'}
            variant="compact"
          />
          
          <KpiCard
            title="Taxa de Erros"
            value={formatPercentage(currentErrors)}
            subtitle="Requisições com falha"
            icon={TrendingUp}
            status={currentErrors <= 0.3 ? 'success' : 'critical'}
            variant="compact"
          />
          
          <KpiCard
            title="Tráfego"
            value={`${currentTraffic} req/s`}
            subtitle="Requisições por segundo"
            icon={Activity}
            status="info"
            variant="compact"
          />
          
          <KpiCard
            title="Saturação CPU"
            value={formatPercentage(currentCPU)}
            subtitle="Utilização do processador"
            icon={Server}
            status={currentCPU <= 70 ? 'success' : currentCPU <= 85 ? 'warning' : 'critical'}
            variant="compact"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy Chart - 2 columns */}
          <div className="lg:col-span-2">
            <EnergyAreaChart data={energyData} />
          </div>
          
          {/* PUE Gauge - 1 column */}
          <div className="lg:col-span-1">
            <PueGauge value={currentPUE} target={1.3} />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Marketplace Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marketplace de Recursos</h3>
            <div className="grid grid-cols-2 gap-4">
              <KpiCard
                title="Slots Disponíveis"
                value={marketplaceSummary?.total_slots_available || 0}
                subtitle="CPU/GPU/Storage"
                icon={Server}
                status="info"
                variant="compact"
              />
              
              <KpiCard
                title="Utilização"
                value={formatPercentage(marketplaceSummary?.utilization_pct || 0)}
                subtitle="Recursos alugados"
                icon={TrendingUp}
                status="success"
                variant="compact"
              />
              
              <KpiCard
                title="Receita Estimada"
                value={`$${marketplaceSummary?.estimated_revenue_monthly?.toFixed(0) || 0}`}
                subtitle="Mensal (simulado)"
                icon={DollarSign}
                status="success"
                variant="compact"
              />
              
              <KpiCard
                title="Clientes Ativos"
                value="12"
                subtitle="Solicitações ativas"
                icon={Activity}
                status="info"
                variant="compact"
              />
            </div>
          </div>
          
          {/* Quick Actions & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status do Sistema</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
                <span className="text-sm font-medium">Geração Solar</span>
                <span className="text-success font-semibold">Ativa</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm font-medium">Modo Operação</span>
                <span className="text-primary font-semibold">Performance</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/30">
                <span className="text-sm font-medium">Manutenção</span>
                <span className="text-warning font-semibold">Agendada 02:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <AlertsTable alerts={alerts.slice(0, 8)} />
      </div>
    </DashboardLayout>
  );
}

// Helper function for PUE formatting
function formatPUE(pue: number): string {
  return pue.toFixed(2);
}