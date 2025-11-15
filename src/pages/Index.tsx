import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Upload, 
  FileCheck, 
  BarChart3, 
  UserPlus,
  LogIn,
  Settings
} from "lucide-react";

const Index = () => {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "View your overview and analysis history",
      icon: LayoutDashboard,
      path: "/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upload Documents",
      description: "Upload PDFs, images, or slides with emissions data",
      icon: Upload,
      path: "/upload",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Data Readiness",
      description: "Check data coverage and missing fields",
      icon: FileCheck,
      path: "/readiness",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Analysis Dashboard",
      description: "View detailed emissions analysis and insights",
      icon: BarChart3,
      path: "/analysis",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Onboarding",
      description: "Set up your company profile and preferences",
      icon: Settings,
      path: "/onboarding",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Sign In",
      description: "Access your existing account",
      icon: LogIn,
      path: "/signin",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Sign Up",
      description: "Create a new account to get started",
      icon: UserPlus,
      path: "/signup",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Quick Navigation Hub */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Navigation</h2>
            <p className="text-muted-foreground text-lg">
              Access all features and pages from here
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${link.bgColor} flex items-center justify-center mb-2`}>
                        <Icon className={`h-6 w-6 ${link.color}`} />
                      </div>
                      <CardTitle className="text-xl">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Go to {link.title}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
