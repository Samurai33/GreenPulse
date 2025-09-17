import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";

interface EnergyData {
  ts: string;
  solar_kwh: number;
  grid_kwh: number;
  it_load_kwh: number;
  overhead_kwh: number;
}

interface EnergyAreaChartProps {
  data: EnergyData[];
  className?: string;
}

export function EnergyAreaChart({ data, className }: EnergyAreaChartProps) {
  // Transform data for chart
  const chartData = data.map(item => ({
    time: new Date(item.ts).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    'Geração Solar': item.solar_kwh,
    'Energia da Rede': item.grid_kwh,
    'Consumo IT': item.it_load_kwh,
    'Overhead': item.overhead_kwh,
    total_consumption: item.it_load_kwh + item.overhead_kwh
  }));

  // Calculate totals for current day
  const totals = data.reduce((acc, curr) => ({
    solar: acc.solar + curr.solar_kwh,
    grid: acc.grid + curr.grid_kwh,
    consumption: acc.consumption + curr.it_load_kwh + curr.overhead_kwh
  }), { solar: 0, grid: 0, consumption: 0 });

  const solarPercentage = ((totals.solar / (totals.solar + totals.grid)) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium mb-2">{`Horário: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toFixed(2)} kWh`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Energia em Tempo Quase Real</CardTitle>
          <Badge className="bg-gradient-success text-white">
            {solarPercentage}% Solar
          </Badge>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Solar: {totals.solar.toFixed(1)} kWh</span>
          <span>Rede: {totals.grid.toFixed(1)} kWh</span>
          <span>Consumo: {totals.consumption.toFixed(1)} kWh</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="Geração Solar"
              stackId="1"
              stroke="hsl(var(--success))"
              fill="url(#solarGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Energia da Rede"
              stackId="1"
              stroke="hsl(var(--warning))"
              fill="url(#gridGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Consumo IT"
              stackId="2"
              stroke="hsl(var(--primary))"
              fill="url(#consumptionGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}