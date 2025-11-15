import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Electricity", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Natural Gas", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Vehicles", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Refrigerants", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 4, color: "hsl(var(--chart-5))" },
];

export function EmissionsBreakdownChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions Breakdown by Source</CardTitle>
        <CardDescription>Based on reported sources only (partial data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, "Percentage"]}
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

