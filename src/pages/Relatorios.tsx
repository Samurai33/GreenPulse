import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
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

export default function Relatorios() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [generating, setGenerating] = useState<string | null>(null);

  const reportTypes: ReportConfig[] = [
    {
      type: 'energy',
      title: t('relatorios.types.energy.title'),
      description: t('relatorios.types.energy.description'),
      formats: ['CSV', 'JSON'],
      icon: FileSpreadsheet
    },
    {
      type: 'co2',
      title: t('relatorios.types.co2.title'),
      description: t('relatorios.types.co2.description'),
      formats: ['CSV', 'JSON'],
      icon: FileText
    },
    {
      type: 'pue',
      title: t('relatorios.types.pue.title'),
      description: t('relatorios.types.pue.description'),
      formats: ['CSV', 'JSON'],
      icon: FileSpreadsheet
    },
    {
      type: 'incidents',
      title: t('relatorios.types.incidents.title'),
      description: t('relatorios.types.incidents.description'),
      formats: ['CSV', 'JSON'],
      icon: FileText
    },
    {
      type: 'marketplace',
      title: t('relatorios.types.marketplace.title'),
      description: t('relatorios.types.marketplace.description'),
      formats: ['CSV', 'JSON'],
      icon: FileSpreadsheet
    },
    {
      type: 'sre',
      title: t('relatorios.types.sre.title'),
      description: t('relatorios.types.sre.description'),
      formats: ['CSV', 'JSON'],
      icon: FileText
    }
  ];

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
            <h1 className="text-3xl font-bold text-foreground">{t('relatorios.title')}</h1>
            <p className="text-muted-foreground">
              {t('relatorios.subtitle')}
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
                  <SelectItem value="1d">{t('relatorios.controls.lastDay')}</SelectItem>
                  <SelectItem value="7d">{t('relatorios.controls.last7Days')}</SelectItem>
                  <SelectItem value="30d">{t('relatorios.controls.last30Days')}</SelectItem>
                  <SelectItem value="90d">{t('relatorios.controls.last90Days')}</SelectItem>
                  <SelectItem value="1y">{t('relatorios.controls.lastYear')}</SelectItem>
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
                {t('relatorios.actions.generateSnapshot')}
              </Button>
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {t('relatorios.actions.viewData')}
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
              {t('relatorios.summary.title')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('relatorios.summary.period')}: {selectedPeriod === '1d' ? t('relatorios.controls.lastDay') : 
                                   selectedPeriod === '7d' ? t('relatorios.controls.last7Days') :
                                   selectedPeriod === '30d' ? t('relatorios.controls.last30Days') :
                                   selectedPeriod === '90d' ? t('relatorios.controls.last90Days') : t('relatorios.controls.lastYear')}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Energy Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-success rounded-full" />
                  {t('relatorios.summary.energyData')}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('relatorios.summary.energyItems.0')}</li>
                  <li>• {t('relatorios.summary.energyItems.1')}</li>
                  <li>• {t('relatorios.summary.energyItems.2')}</li>
                  <li>• {t('relatorios.summary.energyItems.3')}</li>
                </ul>
              </div>

              {/* Environmental Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  {t('relatorios.summary.environmentalData')}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('relatorios.summary.environmentalItems.0')}</li>
                  <li>• {t('relatorios.summary.environmentalItems.1')}</li>
                  <li>• {t('relatorios.summary.environmentalItems.2')}</li>
                  <li>• {t('relatorios.summary.environmentalItems.3')}</li>
                </ul>
              </div>

              {/* Operational Data */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  {t('relatorios.summary.operationalData')}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('relatorios.summary.operationalItems.0')}</li>
                  <li>• {t('relatorios.summary.operationalItems.1')}</li>
                  <li>• {t('relatorios.summary.operationalItems.2')}</li>
                  <li>• {t('relatorios.summary.operationalItems.3')}</li>
                </ul>
              </div>
            </div>

            {/* Disclaimers */}
            <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <h4 className="font-medium text-warning mb-2">{t('relatorios.warnings.title')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t('relatorios.warnings.items.0')}</li>
                <li>• {t('relatorios.warnings.items.1')}</li>
                <li>• {t('relatorios.warnings.items.2')}</li>
                <li>• {t('relatorios.warnings.items.3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}