import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface PueGaugeProps {
  value: number;
  target?: number;
  className?: string;
}

export function PueGauge({ value, target = 1.3, className }: PueGaugeProps) {
  // Normalize PUE value for gauge (1.0 = 0%, 2.5 = 100%)
  const normalizedValue = Math.min(100, Math.max(0, ((value - 1.0) / 1.5) * 100));
  const normalizedTarget = Math.min(100, Math.max(0, ((target - 1.0) / 1.5) * 100));
  
  const data = [
    { name: 'current', value: normalizedValue },
    { name: 'remaining', value: 100 - normalizedValue }
  ];

  const getStatusColor = (pue: number) => {
    if (pue <= 1.2) return '#10B981'; // success
    if (pue <= 1.3) return '#F59E0B'; // warning  
    return '#EF4444'; // critical
  };

  const getStatusText = (pue: number) => {
    if (pue <= target) return 'Excelente';
    if (pue <= target + 0.1) return 'Boa';
    if (pue <= target + 0.2) return 'Atenção';
    return 'Crítica';
  };

  const currentColor = getStatusColor(value);
  const status = getStatusText(value);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">PUE Atual</CardTitle>
          <Badge 
            variant={value <= target ? "default" : "destructive"}
            className="text-xs"
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Meta: ≤{target.toFixed(1)} | The Green Grid
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        <div className="relative h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={currentColor} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold" style={{ color: currentColor }}>
              {value.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">PUE</div>
          </div>
          
          {/* Target indicator */}
          <div 
            className="absolute bottom-4 w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${20 + (normalizedTarget * 0.6)}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between w-full text-sm">
          <span className="text-success">1.0</span>
          <span className="text-primary">Meta: {target}</span>
          <span className="text-destructive">2.5</span>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Power Usage Effectiveness
          </p>
          <p className="text-xs text-muted-foreground">
            Total Facility Power / IT Equipment Power
          </p>
        </div>
      </CardContent>
    </Card>
  );
}