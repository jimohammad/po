import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, FileText, Globe2, Lock, BarChart3, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Iqbal Electronics Co. WLL</h1>
              <p className="text-xs text-muted-foreground">Purchase Order Register</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleLogin} data-testid="button-login">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Streamline Your Purchase Management
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive solution for tracking supplier invoices, managing multi-currency transactions, 
            and generating detailed purchase reports.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Purchase Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Record and manage purchase orders with detailed line items, 
                invoice numbers, and delivery tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Globe2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Multi-Currency Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Handle transactions in KWD, AED, and USD with automatic 
                currency conversion and rate tracking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Reporting & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate monthly reports, track spending trends, 
                and filter by date, supplier, or document status.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Supplier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Maintain a master list of suppliers with easy add, edit, 
                and delete functionality.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Secure Document Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload and store invoices, delivery notes, and TT copies 
                securely in the cloud.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-lg">Item Master</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage your inventory items with quick selection during 
                purchase order entry.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleLogin} data-testid="button-login-cta">
            Get Started
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Sign in with your account to access the purchase order system.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Iqbal Electronics Co. WLL - Purchase Order Register System
        </div>
      </footer>
    </div>
  );
}
