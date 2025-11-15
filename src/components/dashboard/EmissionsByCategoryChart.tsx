import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { category: "Electricity", emissions: 450 },
  { category: "Natural Gas", emissions: 250 },
  { category: "Vehicles", emissions: 180 },
  { category: "Refrigerants", emissions: 80 },
  { category: "Other", emissions: 40 },
];

export function EmissionsByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emissions by Category</CardTitle>
        <CardDescription>Total emissions in tCO₂e</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              formatter={(value) => [`${value} tCO₂e`, "Emissions"]}
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Bar dataKey="emissions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

