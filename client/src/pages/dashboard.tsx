import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, TrendingUp, ShoppingCart, Search, Loader2, ArrowRight } from "lucide-react";

interface DashboardStats {
  totalStock: number;
  totalCash: number;
  monthlySales: number;
  monthlyPurchases: number;
}

interface SearchResult {
  type: string;
  id: number;
  title: string;
  subtitle: string;
  url: string;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: searchQuery.length >= 2,
  });

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery("");
    setLocation(result.url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers, suppliers, items, invoices..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          data-testid="input-global-search"
        />
        {showResults && searchQuery.length >= 2 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
            <CardContent className="p-2">
              {searchLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}-${index}`}
                      className="flex items-center justify-between p-2 rounded-md cursor-pointer hover-elevate"
                      onClick={() => handleResultClick(result)}
                      data-testid={`search-result-${result.type.toLowerCase()}-${result.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No results found
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card data-testid="card-stock-available">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-stock">
                {stats?.totalStock?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total units in inventory</p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-cash">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-cash">
                {formatCurrency(stats?.totalCash || 0)} KWD
              </div>
              <p className="text-xs text-muted-foreground">Across all accounts</p>
            </CardContent>
          </Card>

          <Card data-testid="card-monthly-sales">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-monthly-sales">
                {formatCurrency(stats?.monthlySales || 0)} KWD
              </div>
              <p className="text-xs text-muted-foreground">{currentMonth}</p>
            </CardContent>
          </Card>

          <Card data-testid="card-monthly-purchases">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-monthly-purchases">
                {formatCurrency(stats?.monthlyPurchases || 0)} KWD
              </div>
              <p className="text-xs text-muted-foreground">{currentMonth}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
