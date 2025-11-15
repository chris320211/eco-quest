import { BarChart3, Leaf, Lightbulb, TrendingDown, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Carbon Tracking",
    description: "Monitor your business's carbon footprint in real-time with detailed analytics and insights."
  },
  {
    icon: TrendingDown,
    title: "Emission Reduction",
    description: "Get personalized recommendations to reduce emissions and improve sustainability."
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "AI-powered suggestions tailored to your industry and business size."
  },
  {
    icon: Zap,
    title: "Energy Optimization",
    description: "Identify energy waste and optimize consumption to lower costs and emissions."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Engage your entire team in sustainability initiatives with shared dashboards."
  },
  {
    icon: Leaf,
    title: "Compliance Reports",
    description: "Generate compliance reports for certifications and sustainability goals."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Everything You Need to Go Green
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful tools designed specifically for small businesses to make sustainability simple and measurable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
