import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { category: "Energy", missing: 3 },
  { category: "Fuel", missing: 5 },
  { category: "Vehicles", missing: 2 },
  { category: "Refrigerants", missing: 4 },
  { category: "Waste", missing: 6 },
];

export function MissingDataChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Data by Category</CardTitle>
        <CardDescription>Number of missing required fields per category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              formatter={(value) => [`${value} fields`, "Missing"]}
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Bar dataKey="missing" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

