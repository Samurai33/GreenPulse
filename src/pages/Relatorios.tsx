import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileJson,
  Printer,
  Eye,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  formats: string[];
  icon: any;
}

const reportTypes: ReportConfig[] = [
  {
    type: 'energy',
    title: 'Relatório de Energia',
    description: 'Dados de consumo, geração solar e PUE diário',
    formats: ['CSV', 'JSON'],
    icon: FileSpreadsheet
  },
  {
    type: 'co2',
    title: 'Relatório de CO₂ Evitado',
    description: 'Impacto ambiental e créditos de carbono estimados',
    formats: ['CSV', 'JSON'],
    icon: FileText
  },
  {
    type: 'pue',
    title: 'Histórico PUE',
    description: 'Evolução da eficiência energética (30 dias)',
    formats: ['CSV', 'JSON'],
    icon: FileSpreadsheet
  },
  {
    type: 'incidents',
    title: 'Relatório de Incidentes',
    description: 'Log de incidentes, MTTR e MTBF',
    formats: ['CSV', 'JSON'],
    icon: FileText
  },
  {
    type: 'marketplace',
    title: 'Marketplace de Recursos',
    description: 'Ofertas, jobs executados e receita',
    formats: ['CSV', 'JSON'],
    icon: FileSpreadsheet
  },
  {
    type: 'sre',
    title: 'Golden Signals SRE',
    description: 'Métricas de latência, erros e saturação',
    formats: ['CSV', 'JSON'],
    icon: FileText
  }
];

export default function Relatorios() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: string, format: string) => {
    setGenerating(`${reportType}-${format}`);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock data based on report type
      let data: any[] = [];
      let filename = '';
      
      switch (reportType) {
        case 'energy':
          data = [
            { date: '2025-09-17', solar_kwh: 42.3, grid_kwh: 28.7, it_load_kwh: 65.2, pue: 1.28 },
            { date: '2025-09-16', solar_kwh: 38.9, grid_kwh: 32.1, it_load_kwh: 67.8, pue: 1.31 },
            { date: '2025-09-15', solar_kwh: 41.7, grid_kwh: 25.9, it_load_kwh: 64.1, pue: 1.26 }
          ];
          filename = `energia_${selectedPeriod}.${format.toLowerCase()}`;
          break;
          
        case 'co2':
          data = [
            { date: '2025-09-17', co2_avoided_kg: 15.2, credits_estimated: 0.052 },
            { date: '2025-09-16', co2_avoided_kg: 14.8, credits_estimated: 0.051 },
            { date: '2025-09-15', co2_avoided_kg: 16.1, credits_estimated: 0.055 }
          ];
          filename = `co2_evitado_${selectedPeriod}.${format.toLowerCase()}`;
          break;
          
        case 'marketplace':
          data = [
            { job_id: 'JOB-7781', type: 'CPU', hours: 12, cost: 0.72, status: 'completed' },
            { job_id: 'JOB-7782', type: 'GPU', hours: 3, cost: 2.55, status: 'running' },
            { job_id: 'JOB-7783', type: 'Storage', hours: 168, cost: 3.36, status: 'completed' }
          ];
          filename = `marketplace_${selectedPeriod}.${format.toLowerCase()}`;
          break;
          
        default:
          data = [{ info: 'Mock data for demonstration' }];
          filename = `${reportType}_${selectedPeriod}.${format.toLowerCase()}`;
      }
      
      // Generate file content
      let content = '';
      if (format === 'CSV') {
        if (data.length > 0) {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(item => Object.values(item).join(','));
          content = [headers, ...rows].join('\n');
        }
      } else {
        content = JSON.stringify(data, null, 2);
      }
      
      // Download file
      const blob = new Blob([content], { 
        type: format === 'CSV' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório gerado",
        description: `${filename} foi baixado com sucesso.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateSnapshot = async () => {
    setGenerating('snapshot');
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll download a CSV instead of PDF
      const snapshotData = [
        { metric: 'PUE Atual', value: '1.28' },
        { metric: 'Uptime 30d', value: '99.7%' },
        { metric: 'CO2 Evitado Hoje', value: '5.1 kg' },
        { metric: 'Créditos Estimados YTD', value: '1.74' },
        { metric: 'Utilização Marketplace', value: '34.6%' }
      ];
      
      const content = 'metric,value\n' + 
        snapshotData.map(item => `${item.metric},${item.value}`).join('\n');
      
      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snapshot_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Snapshot gerado",
        description: "Snapshot do dashboard foi baixado como CSV (PDF em desenvolvimento).",
      });
      
    } catch (error) {
      toast({
        title: "Erro ao gerar snapshot",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">
              Exportação de dados e geração de relatórios para análise
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Último dia</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerateSnapshot}
                disabled={generating === 'snapshot'}
                className="bg-gradient-primary"
              >
                {generating === 'snapshot' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Gerar Snapshot PDF
              </Button>
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Dados
              </Button>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            
            return (
              <Card key={report.type} className="relative overflow-hidden hover:shadow-hover transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Available Formats */}
                  <div className="flex gap-2">
                    {report.formats.map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReport(report.type, format)}
                        disabled={generating === `${report.type}-${format}`}
                        className="flex-1"
                      >
                        {generating === `${report.type}-${format}` ? (
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3 mr-1" />
                        )}
                        {format}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumo de Dados Disponíveis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Período selecionado: {selectedPeriod === '1d' ? 'Último dia' : 
                                   selectedPeriod === '7d' ? 'Últimos 7 dias' :
                                   selectedPeriod === '30d' ? 'Últimos 30 dias' :
                                   selectedPeriod === '90d' ? 'Últimos 90 dias' : 'Último ano'}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Energy Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-success rounded-full" />
                  Dados de Energia
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Geração solar horária</li>
                  <li>• Consumo da rede</li>
                  <li>• Carga IT e overhead</li>
                  <li>• PUE calculado</li>
                </ul>
              </div>

              {/* Environmental Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  Dados Ambientais
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• CO₂ evitado calculado</li>
                  <li>• Estimativas de créditos</li>
                  <li>• Fatores de emissão</li>
                  <li>• Métricas de eficiência</li>
                </ul>
              </div>

              {/* Operational Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  Dados Operacionais
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Golden Signals SRE</li>
                  <li>• Status de hardware</li>
                  <li>• Log de incidentes</li>
                  <li>• Marketplace de recursos</li>
                </ul>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <h4 className="font-medium text-warning mb-2">⚠️ Avisos Importantes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Todos os dados são simulados para fins de demonstração</li>
                <li>• Créditos de carbono são estimativas didáticas sem valor de mercado</li>
                <li>• Para uso oficial, consulte um inventário de GHG certificado</li>
                <li>• Relatórios não substituem auditorias energéticas profissionais</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}