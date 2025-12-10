import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Shield, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SecuritySettingsPage() {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const { data: passwordStatus, isLoading } = useQuery<{ isSet: boolean }>({
    queryKey: ["/api/settings/transaction-password-status"],
  });

  const setPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await apiRequest("POST", "/api/settings/transaction-password", { password });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/transaction-password-status"] });
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Set",
        description: "Transaction password has been set successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set transaction password.",
        variant: "destructive",
      });
    },
  });

  const removePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/settings/transaction-password");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/transaction-password-status"] });
      toast({
        title: "Password Removed",
        description: "Transaction password has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove transaction password.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "Error",
        description: "Password must be at least 4 characters.",
        variant: "destructive",
      });
      return;
    }

    setPasswordMutation.mutate(newPassword);
  };

  const handleRemovePassword = () => {
    setShowRemoveDialog(false);
    removePasswordMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Security Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage transaction security and password protection
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Transaction Password</CardTitle>
            </div>
            <Badge variant={passwordStatus?.isSet ? "default" : "secondary"}>
              {passwordStatus?.isSet ? "Enabled" : "Not Set"}
            </Badge>
          </div>
          <CardDescription>
            When enabled, users will need to enter this password to delete or edit transactions 
            (sales, purchases, payments, returns, expenses). This adds an extra layer of security 
            to protect against accidental or unauthorized modifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  {passwordStatus?.isSet ? "New Password" : "Set Password"}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  data-testid="input-new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  data-testid="input-confirm-password"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="submit"
                disabled={setPasswordMutation.isPending}
                data-testid="button-set-password"
              >
                {setPasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {passwordStatus?.isSet ? "Update Password" : "Set Password"}
              </Button>
              {passwordStatus?.isSet && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRemoveDialog(true)}
                  disabled={removePasswordMutation.isPending}
                  data-testid="button-remove-password"
                >
                  {removePasswordMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Password
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Transaction Password?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disable password protection for editing and deleting transactions. 
              Anyone with edit access will be able to modify transactions without entering a password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemovePassword}>
              Remove Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
