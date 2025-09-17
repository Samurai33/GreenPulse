import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

interface Offer {
  id: string;
  type: string;
  quantity: number;
  unit: string;
  price_per_hour: number;
  sla: string;
  status: string;
  description: string;
  availability_pct: number;
}

interface Job {
  id: string;
  type: string;
  hours: number;
  cost: number;
  status: string;
  client: string;
  started_at: string | null;
  estimated_completion: string | null;
}

interface MarketplaceSummary {
  total_slots_available: number;
  total_slots_rented: number;
  utilization_pct: number;
  estimated_revenue_monthly: number;
  active_clients: number;
  avg_job_duration_hours: number;
}

export default function Recursos() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [summary, setSummary] = useState<MarketplaceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const marketplaceRes = await fetch('/data/marketplace.json');
        const marketplaceData = await marketplaceRes.json();
        
        setOffers(marketplaceData.offers || []);
        setJobs(marketplaceData.jobs || []);
        setSummary(marketplaceData.summary);
      } catch (error) {
        console.error('Erro ao carregar dados do marketplace:', error);
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

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cpu': return Cpu;
      case 'gpu': return Server;
      case 'storage': return HardDrive;
      case 'memory': return MemoryStick;
      default: return Server;
    }
  };

  const getSlaColor = (sla: string) => {
    switch (sla) {
      case 'gold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'silver': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'bronze': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-success" />;
      case 'queued': return <Clock className="h-4 w-4 text-warning" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Pause className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatDuration = (startedAt: string | null, estimatedCompletion: string | null) => {
    if (!startedAt || !estimatedCompletion) return 'N/A';
    
    const start = new Date(startedAt);
    const end = new Date(estimatedCompletion);
    const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    return `${hours}h`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Recursos Ociosos</h1>
          <p className="text-muted-foreground">
            Marketplace para compartilhamento de CPU, GPU e armazenamento
          </p>
          
          {/* Disclaimer */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-3 mt-4">
            <p className="text-sm text-info">
              <strong>Conceito:</strong> Inspirado em volunteer/idle computing (BOINC). Esta é uma simulação educativa.
            </p>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Slots Disponíveis"
            value={summary?.total_slots_available || 0}
            subtitle="Total de recursos"
            icon={Server}
            status="info"
            variant="featured"
          />
          
          <KpiCard
            title="Utilização"
            value={`${summary?.utilization_pct?.toFixed(1) || 0}%`}
            subtitle="Recursos em uso"
            icon={TrendingUp}
            status={summary && summary.utilization_pct > 50 ? 'success' : 'warning'}
            trend={{ 
              direction: summary && summary.utilization_pct > 30 ? 'up' : 'down', 
              value: '+5.2%' 
            }}
          />
          
          <KpiCard
            title="Receita Estimada"
            value={`$${summary?.estimated_revenue_monthly?.toFixed(0) || 0}`}
            subtitle="Mensal (simulado)"
            icon={DollarSign}
            status="success"
            trend={{ direction: 'up', value: '+12%' }}
          />
          
          <KpiCard
            title="Clientes Ativos"
            value={summary?.active_clients || 0}
            subtitle="Solicitações ativas"
            icon={Users}
            status="info"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex gap-4">
          <Button className="bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Publicar Oferta
          </Button>
          <Button variant="outline">
            Alugar Recurso
          </Button>
          <Button variant="outline">
            Gerenciar Contratos
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Offers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Ofertas Disponíveis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Recursos que você está oferecendo no marketplace
              </p>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recurso</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço/h</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {offers.map((offer) => {
                    const ResourceIcon = getResourceIcon(offer.type);
                    return (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ResourceIcon className="h-4 w-4" />
                            <div>
                              <div className="font-medium text-sm">{offer.type}</div>
                              <div className="text-xs text-muted-foreground">
                                {offer.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {offer.quantity} {offer.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {offer.availability_pct}% disponível
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium">
                            ${offer.price_per_hour.toFixed(3)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getSlaColor(offer.sla)}>
                            {offer.sla.toUpperCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(offer.status)}
                            <span className="text-sm capitalize">{offer.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Jobs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Jobs Externos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Trabalhos em execução de clientes externos
              </p>
            </CardHeader>
            
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {jobs.map((job) => {
                    const ResourceIcon = getResourceIcon(job.type);
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{job.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.client}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ResourceIcon className="h-4 w-4" />
                            {job.type}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {formatDuration(job.started_at, job.estimated_completion)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.hours}h total
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium text-success">
                            ${job.cost.toFixed(2)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(job.status)}
                            <span className="text-sm capitalize">{job.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Resource Utilization Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer) => {
            const ResourceIcon = getResourceIcon(offer.type);
            const utilizationPct = 100 - offer.availability_pct;
            
            return (
              <Card key={offer.id} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ResourceIcon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{offer.type}</span>
                    </div>
                    <Badge className={getSlaColor(offer.sla)} variant="outline">
                      {offer.sla}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilização:</span>
                      <span className="font-medium">{utilizationPct.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${utilizationPct}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{offer.quantity} {offer.unit} total</span>
                      <span>${offer.price_per_hour.toFixed(3)}/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}