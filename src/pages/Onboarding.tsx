import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Leaf, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Onboarding = () => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [reportingPreferences, setReportingPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePreferenceToggle = (pref: string) => {
    setReportingPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.updateOnboarding({
        country,
        state,
        industry,
        companySize,
        reportingPreferences,
      });

      toast({
        title: "Profile setup complete!",
        description: "Your analysis has been configured based on your information.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save onboarding data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Sustainify</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Company Profile Setup</CardTitle>
            <CardDescription className="text-center">
              We'll configure your analysis based on this information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Company Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Region</Label>
                    <Input
                      id="state"
                      placeholder="California"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry/Sector</Label>
                  <Select value={industry} onValueChange={setIndustry} required>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Professional Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize} required>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (1-9 employees)</SelectItem>
                      <SelectItem value="small">Small (10-49 employees)</SelectItem>
                      <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
                      <SelectItem value="large">Large (250+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reporting Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Reporting Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ghg-basic"
                      checked={reportingPreferences.includes("ghg-basic")}
                      onCheckedChange={() => handlePreferenceToggle("ghg-basic")}
                    />
                    <Label htmlFor="ghg-basic" className="cursor-pointer">
                      Prepare basic emissions summary (GHG Protocol)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sme-style"
                      checked={reportingPreferences.includes("sme-style")}
                      onCheckedChange={() => handlePreferenceToggle("sme-style")}
                    />
                    <Label htmlFor="sme-style" className="cursor-pointer">
                      Align to SME-style reporting (VSME Environmental)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="customer-questionnaire"
                      checked={reportingPreferences.includes("customer-questionnaire")}
                      onCheckedChange={() => handlePreferenceToggle("customer-questionnaire")}
                    />
                    <Label htmlFor="customer-questionnaire" className="cursor-pointer">
                      Prepare for customer questionnaires
                    </Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue to Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

