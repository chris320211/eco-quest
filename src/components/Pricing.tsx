import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for small businesses just starting their sustainability journey",
    features: [
      "Carbon footprint tracking",
      "Basic analytics dashboard",
      "Up to 5 team members",
      "Monthly reports",
      "Email support",
      "Mobile app access"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "149",
    description: "For growing businesses serious about sustainability",
    features: [
      "Everything in Starter",
      "Advanced analytics & AI insights",
      "Up to 25 team members",
      "Custom reduction strategies",
      "Priority support",
      "API access",
      "Compliance certifications",
      "Quarterly expert consultations"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for larger organizations",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "24/7 phone support",
      "On-site training",
      "Custom reporting"
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative border-border ${
                plan.popular 
                  ? 'shadow-elegant border-primary/50 scale-105' 
                  : 'hover:shadow-soft'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    {plan.price !== "Custom" && (
                      <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                    )}
                    {plan.price === "Custom" && (
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    )}
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <p className="text-center text-muted-foreground mt-12">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
