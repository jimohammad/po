import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Database, Shield, Clock } from "lucide-react";

export default function BackupPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/backup/download");
      
      if (!response.ok) {
        throw new Error("Failed to download backup");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "ERP_Backup.xlsx";
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Backup Downloaded",
        description: `File saved as ${filename}`,
      });
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Backup Failed",
        description: "Could not download backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="heading-backup">Database Backup</h1>
        <p className="text-muted-foreground">Download a complete backup of your business data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Full Database Backup
          </CardTitle>
          <CardDescription>
            Download all your data in Excel format for safekeeping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Complete Data</p>
                <p className="text-xs text-muted-foreground">All tables exported including purchases, sales, payments, parties, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Download className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Excel Format</p>
                <p className="text-xs text-muted-foreground">Easy to open in Excel or Google Sheets for review</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Timestamped</p>
                <p className="text-xs text-muted-foreground">Each backup file includes date and time in filename</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Data Included:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Branches", "Users", "Parties", "Items", "Customers",
                "Purchases", "Sales", "Payments", "Expenses", "Returns",
                "Stock Transfers", "Account Transfers", "Opening Balances", "Discounts"
              ].map((item) => (
                <span key={item} className="px-2 py-1 bg-muted rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={handleDownloadBackup}
            disabled={isDownloading}
            className="w-full md:w-auto"
            data-testid="button-download-backup"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Backup...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Backup
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Download backups regularly (daily or weekly recommended)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Store backup files in a secure location (cloud storage, external drive)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              Keep multiple backup versions (at least last 7 days)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              Test your backups occasionally by opening the Excel file
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
