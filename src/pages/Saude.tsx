import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Cpu,
  HardDrive,
  Thermometer,
  Fan,
  Network,
  FileText,
  ExternalLink
} from "lucide-react";

interface SreMetrics {
  golden_signals: {
    latency_ms_p50: number[];
    latency_ms_p95: number[];
    error_rate_pct: number[];
    traffic_rps: number[];
    saturation: {
      cpu_pct: number[];
      ram_pct: number[];
    };
  };
  hardware: {
    cpu_temp_c: number[];
    disks: Array<{
      id: string;
      smart: string;
      temp_c: number;
      wear_level: number;
    }>;
    fans: Array<{
      id: string;
      rpm: number;
      status: string;
    }>;
    network: {
      jitter_ms: number[];
      packet_loss_pct: number[];
    };
  };
  incidents: Array<{
    id: string;
    sev: string;
    title: string;
    startedAt: string;
    status: string;
    mttr_min: number;
  }>;
  uptime_30d: number;
  mtbf_hours: number;
  mttr_avg_min: number;
}

export default function Saude() {
  const [sreData, setSreData] = useState<SreMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sreRes = await fetch('/data/sre_metrics.json');
        const sreMetrics = await sreRes.json();
        
        setSreData(sreMetrics);
      } catch (error) {
        console.error('Erro ao carregar dados SRE:', error);
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

  if (!sreData) return null;

  // Prepare chart data for Golden Signals
  const goldenSignalsData = sreData.golden_signals.latency_ms_p95.map((_, index) => ({
    time: index,
    'Latência P50': sreData.golden_signals.latency_ms_p50[index],
    'Latência P95': sreData.golden_signals.latency_ms_p95[index],
    'Taxa de Erros (%)': sreData.golden_signals.error_rate_pct[index],
    'Tráfego (req/s)': sreData.golden_signals.traffic_rps[index] / 10, // Scale down for display
    'CPU (%)': sreData.golden_signals.saturation.cpu_pct[index],
    'RAM (%)': sreData.golden_signals.saturation.ram_pct[index],
  }));

  // Get latest values
  const latest = goldenSignalsData[goldenSignalsData.length - 1];
  const latestHardware = {
    cpu_temp: sreData.hardware.cpu_temp_c[sreData.hardware.cpu_temp_c.length - 1],
    jitter: sreData.hardware.network.jitter_ms[sreData.hardware.network.jitter_ms.length - 1],
    packet_loss: sreData.hardware.network.packet_loss_pct[sreData.hardware.network.packet_loss_pct.length - 1],
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'text-success';
      case 'WARN': return 'text-warning';
      case 'FAULT': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Saúde do Servidor</h1>
          <p className="text-muted-foreground">
            Métricas SRE, Golden Signals e monitoramento de hardware
          </p>
        </div>

        {/* Golden Signals KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Latência P95"
            value={`${latest['Latência P95']}ms`}
            subtitle="Tempo de resposta 95º percentil"
            icon={Clock}
            status={latest['Latência P95'] <= 150 ? 'success' : 'warning'}
            trend={{ 
              direction: latest['Latência P95'] <= 150 ? 'down' : 'up', 
              value: latest['Latência P95'] <= 150 ? 'Boa' : 'Alta'
            }}
            variant="featured"
          />
          
          <KpiCard
            title="Taxa de Erros"
            value={`${latest['Taxa de Erros (%)'].toFixed(2)}%`}
            subtitle="Requisições com falha"
            icon={AlertTriangle}
            status={latest['Taxa de Erros (%)'] <= 0.3 ? 'success' : 'critical'}
          />
          
          <KpiCard
            title="Tráfego"
            value={`${(latest['Tráfego (req/s)'] * 10).toFixed(0)} req/s`}
            subtitle="Requisições por segundo"
            icon={Activity}
            status="info"
          />
          
          <KpiCard
            title="Saturação CPU"
            value={`${latest['CPU (%)'].toFixed(1)}%`}
            subtitle="Utilização do processador"
            icon={Cpu}
            status={latest['CPU (%)'] <= 70 ? 'success' : latest['CPU (%)'] <= 85 ? 'warning' : 'critical'}
          />
        </div>

        {/* Reliability Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            title="Uptime 30d"
            value={`${sreData.uptime_30d}%`}
            subtitle="Disponibilidade do sistema"
            icon={CheckCircle}
            status="success"
            trend={{ direction: 'up', value: '+0.2%' }}
          />
          
          <KpiCard
            title="MTBF"
            value={`${sreData.mtbf_hours}h`}
            subtitle="Mean Time Between Failures"
            icon={Clock}
            status="info"
          />
          
          <KpiCard
            title="MTTR Médio"
            value={`${sreData.mttr_avg_min}min`}
            subtitle="Mean Time To Recovery"
            icon={Activity}
            status="success"
          />
        </div>

        {/* Golden Signals Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latency Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Latência (ms)</CardTitle>
              <p className="text-sm text-muted-foreground">P50 e P95 nas últimas 24 horas</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={goldenSignalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Latência P50" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Latência P95" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Error Rate & Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Erros & Tráfego</CardTitle>
              <p className="text-sm text-muted-foreground">Taxa de erros e volume de requisições</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={goldenSignalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Taxa de Erros (%)" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Tráfego (req/s)" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hardware Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Status do Hardware
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* CPU Temperature */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span className="font-medium">Temperatura CPU</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{latestHardware.cpu_temp}°C</span>
                  <Badge variant={latestHardware.cpu_temp <= 70 ? 'default' : 'destructive'}>
                    {latestHardware.cpu_temp <= 70 ? 'OK' : 'ALTA'}
                  </Badge>
                </div>
              </div>

              {/* Network Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span className="font-medium">Jitter de Rede</span>
                  </div>
                  <span>{latestHardware.jitter.toFixed(1)}ms</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span className="font-medium">Perda de Pacotes</span>
                  </div>
                  <span>{(latestHardware.packet_loss * 100).toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disk & Fan Status */}
          <div className="space-y-4">
            {/* Disks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Status dos Discos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disco</TableHead>
                      <TableHead>S.M.A.R.T.</TableHead>
                      <TableHead>Temp</TableHead>
                      <TableHead>Desgaste</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sreData.hardware.disks.map((disk) => (
                      <TableRow key={disk.id}>
                        <TableCell className="font-mono text-sm">{disk.id}</TableCell>
                        <TableCell>
                          <span className={getStatusColor(disk.smart)}>
                            {disk.smart}
                          </span>
                        </TableCell>
                        <TableCell>{disk.temp_c}°C</TableCell>
                        <TableCell>{disk.wear_level}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Fans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fan className="h-5 w-5" />
                  Status dos Ventiladores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {sreData.hardware.fans.map((fan) => (
                    <div key={fan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">{fan.id}</div>
                        <div className="text-sm text-muted-foreground">{fan.rpm} RPM</div>
                      </div>
                      <Badge variant={fan.status === 'OK' ? 'default' : 'destructive'}>
                        {fan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Incidents Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Histórico de Incidentes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Últimos incidentes e tempo de resolução
                </p>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Runbooks
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Iniciado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MTTR</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {sreData.incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    
                    <TableCell>
                      <Badge variant={getSeverityColor(incident.sev) as any}>
                        {incident.sev.toUpperCase()}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="max-w-xs">
                      {incident.title}
                    </TableCell>
                    
                    <TableCell className="text-sm">
                      {new Date(incident.startedAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={incident.status === 'resolved' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>{incident.mttr_min}min</TableCell>
                    
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}