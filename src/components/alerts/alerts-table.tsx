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
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Bell,
  BellOff,
  ExternalLink
} from "lucide-react";

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

interface AlertsTableProps {
  alerts: Alert[];
  className?: string;
}

export function AlertsTable({ alerts, className }: AlertsTableProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
      default:
        return 'secondary';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      'restart_inverter': 'Reiniciar Inversor',
      'contact_technician': 'Contatar Técnico',
      'schedule_replacement': 'Agendar Substituição',
      'backup_data': 'Backup de Dados',
      'check_routing': 'Verificar Roteamento',
      'monitor': 'Monitorar',
      'increase_fan_speed': 'Aumentar Velocidade do Fan',
      'check_cooling': 'Verificar Refrigeração',
      'replace_fan': 'Substituir Fan',
      'enable_backup_cooling': 'Ativar Refrigeração de Backup',
      'approve_request': 'Aprovar Solicitação',
      'allocate_resources': 'Alocar Recursos',
      'optimize_cooling': 'Otimizar Refrigeração',
      'redistribute_load': 'Redistribuir Carga',
      'confirm_maintenance': 'Confirmar Manutenção',
      'notify_users': 'Notificar Usuários'
    };
    return actionMap[action] || action;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertas Recentes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {alerts.filter(a => !a.acknowledged).length} não reconhecidos de {alerts.length} total
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Alerta</TableHead>
              <TableHead className="w-32">Origem</TableHead>
              <TableHead className="w-32">Horário</TableHead>
              <TableHead className="w-40">Ações</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className={`
                ${!alert.acknowledged ? 'bg-muted/30' : ''}
                hover:bg-muted/50 transition-colors
              `}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getSeverityColor(alert.severity) as any}
                      className="gap-1"
                    >
                      {getSeverityIcon(alert.severity)}
                      <span className="sr-only">{alert.severity}</span>
                    </Badge>
                    {!alert.acknowledged && (
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {alert.source}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-sm">
                  {formatTime(alert.ts)}
                </TableCell>
                
                <TableCell>
                  <div className="flex gap-1">
                    {alert.actions.slice(0, 2).map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        {getActionText(action)}
                      </Button>
                    ))}
                    {alert.actions.length > 2 && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    {!alert.acknowledged && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <BellOff className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}