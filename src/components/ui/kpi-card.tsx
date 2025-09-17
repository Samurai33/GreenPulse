import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  status?: 'success' | 'warning' | 'critical' | 'info';
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export function KpiCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  status = 'info',
  className,
  variant = 'default'
}: KpiCardProps) {
  const statusStyles = {
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5', 
    critical: 'border-destructive/30 bg-destructive/5',
    info: 'border-primary/30 bg-primary/5'
  };

  const statusIconStyles = {
    success: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive', 
    info: 'text-primary'
  };

  const trendStyles = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border backdrop-blur-sm transition-all duration-200 hover:shadow-hover",
      statusStyles[status],
      variant === 'featured' && "bg-gradient-glass shadow-card",
      variant === 'compact' && "p-2",
      className
    )}>
      {variant === 'featured' && (
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      )}
      
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0",
        variant === 'compact' ? "pb-2" : "pb-2"
      )}>
        <div className="flex items-center space-x-2">
          {Icon && (
            <Icon className={cn(
              "h-4 w-4",
              statusIconStyles[status]
            )} />
          )}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        
        {trend && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              trendStyles[trend.direction],
              "border-current/30 bg-current/10"
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className={cn(
        variant === 'compact' ? "pt-0" : "pt-0"
      )}>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}