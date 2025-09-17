import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCard } from "@/components/ui/kpi-card";
import { PueGauge } from "@/components/charts/pue-gauge";
import { EnergyAreaChart } from "@/components/charts/energy-area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Leaf, 
  Award, 
  Sun,
  Battery,
  Factory,
  TreePine,
  Info
} from "lucide-react";
import { 
  calculatePUE, 
  calculateCO2Avoided, 
  calculateCarbonCredits,
  calculateDailySummary,
  formatKwh,
  formatCO2
} from "@/lib/kpis";

interface EnergyData {
  ts: string;
  solar_kwh: number;
  grid_kwh: number;
  it_load_kwh: number;
  overhead_kwh: number;
}

export default function Energia() {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [pueDaily, setPueDaily] = useState<{date: string; pue: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const energyRes = await fetch('/data/energy_timeseries.json');
        const energyJson = await energyRes.json();
        
        setEnergyData(energyJson.by_hour || []);
        setPueDaily(energyJson.pue_daily || []);
      } catch (error) {
        console.error('Erro ao carregar dados de energia:', error);
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
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dailySummary = calculateDailySummary(energyData);
  const todayCO2Avoided = calculateCO2Avoided(dailySummary.solar, {
    solar_kg_per_kwh: 0.045,
    grid_kg_per_kwh: 0.4
  });
  
  const ytdCO2Avoided = todayCO2Avoided * 30; // Simulate YTD
  const carbonCredits = calculateCarbonCredits(ytdCO2Avoided);

  // Prepare CO2 accumulation chart data (simulate 30 days)
  const co2AccumulationData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    co2_avoided_cumulative: (i + 1) * (todayCO2Avoided * (0.8 + Math.random() * 0.4))
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Energia & Carbono</h1>
          <p className="text-muted-foreground">
            Monitoramento energético e impacto ambiental do datacenter
          </p>
        </div>

        {/* Energy KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Geração Solar"
            value={formatKwh(dailySummary.solar)}
            subtitle="Energia limpa gerada hoje"
            icon={Sun}
            status="success"
            trend={{ direction: 'up', value: '+18%' }}
            variant="featured"
          />
          
          <KpiCard
            title="Energia da Rede"
            value={formatKwh(dailySummary.grid)}
            subtitle="Consumo da rede elétrica"
            icon={Zap}
            status="warning"
            trend={{ direction: 'down', value: '-12%' }}
          />
          
          <KpiCard
            title="Consumo IT"
            value={formatKwh(dailySummary.it_load)}
            subtitle="Carga dos equipamentos"
            icon={Factory}
            status="info"
            trend={{ direction: 'neutral', value: 'Estável' }}
          />
          
          <KpiCard
            title="Perdas/Overhead"
            value={formatKwh(dailySummary.overhead)}
            subtitle="Refrigeração e auxiliares"
            icon={Battery}
            status="info"
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy Flow Chart */}
          <div className="lg:col-span-2">
            <EnergyAreaChart data={energyData} />
          </div>
          
          {/* PUE Gauge */}
          <div className="lg:col-span-1">
            <PueGauge value={dailySummary.avg_pue} target={1.3} />
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CO2 Avoided Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-success" />
                CO₂ Evitado Acumulado
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Benefício ambiental da geração solar (últimos 30 dias)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={co2AccumulationData}>
                  <defs>
                    <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} kg`, 'CO₂ Evitado']}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="co2_avoided_cumulative"
                    stroke="hsl(var(--success))"
                    fill="url(#co2Gradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Carbon Credits & Impact */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Créditos de Carbono Estimados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {carbonCredits.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    tCO₂e (toneladas de CO₂ equivalente)
                  </div>
                  <Badge className="mt-2 bg-warning/20 text-warning border-warning/30">
                    NÃO OFICIAL
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>CO₂ evitado hoje:</span>
                    <span className="font-medium">{formatCO2(todayCO2Avoided)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO₂ evitado YTD:</span>
                    <span className="font-medium">{formatCO2(ytdCO2Avoided)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 crédito equivale:</span>
                    <span className="font-medium">1 tCO₂e</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Info */}
            <Card className="bg-info/5 border-info/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  Escopos GHG Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-primary">Escopo 1</div>
                  <p className="text-muted-foreground">
                    Emissões diretas do site (ex.: geradores a diesel)
                  </p>
                </div>
                
                <div>
                  <div className="font-medium text-accent">Escopo 2</div>
                  <p className="text-muted-foreground">
                    Eletricidade comprada da rede elétrica
                  </p>
                </div>
                
                <div>
                  <div className="font-medium text-purple">Escopo 3</div>
                  <p className="text-muted-foreground">
                    Cadeia de valor (upstream/downstream)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PUE Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico PUE (30 dias)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Evolução da eficiência energética - Meta: ≤1.30
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={pueDaily.slice(-30)}>
                <defs>
                  <linearGradient id="pueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis 
                  domain={[1.0, 1.5]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(2), 'PUE']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                />
                {/* Target line */}
                <Area
                  type="monotone"
                  dataKey="pue"
                  stroke="hsl(var(--primary))"
                  fill="url(#pueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}