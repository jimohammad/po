import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SalesChartProps {
  data: Array<{ name: string; sales: number }>;
  formatCurrency: (value: number) => string;
}

export default function SalesChart({ data, formatCurrency }: SalesChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.name,
    thisMonth: index === 1 ? item.sales : 0,
    lastMonth: index === 0 ? item.sales : 0,
    value: item.sales,
  }));

  const combinedData = [
    { name: data[0]?.name || 'Last', lastMonth: data[0]?.sales || 0, thisMonth: data[0]?.sales || 0 },
    { name: data[1]?.name || 'Current', lastMonth: data[0]?.sales || 0, thisMonth: data[1]?.sales || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          className="text-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString()}
          className="text-muted-foreground"
          width={45}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value: number, name: string) => [
            `${formatCurrency(value)} KWD`, 
            name === 'thisMonth' ? 'This Month' : 'Last Month'
          ]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value) => (
            <span style={{ fontSize: '12px', color: 'hsl(var(--foreground))' }}>
              {value === 'thisMonth' ? 'This Month' : 'Last Month'}
            </span>
          )}
        />
        <Area 
          type="monotone" 
          dataKey="lastMonth" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorLastMonth)"
          dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Area 
          type="monotone" 
          dataKey="thisMonth" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorThisMonth)"
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
