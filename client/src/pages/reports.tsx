import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Package, 
  Banknote, 
  Users, 
  Printer,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";

type StockBalanceItem = {
  itemName: string;
  purchased: number;
  sold: number;
  openingStock: number;
  balance: number;
};

type DailyCashFlow = {
  date: string;
  inAmount: number;
  outAmount: number;
  net: number;
  runningBalance: number;
};

type CustomerReportItem = {
  customerId: number;
  customerName: string;
  totalSales: number;
  totalPayments: number;
  balance: number;
};

type ProfitLossReport = {
  netSales: number;
  saleReturns: number;
  grossSales: number;
  costOfGoodsSold: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  expensesByCategory: { category: string; amount: number }[];
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("stock");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [plStartDate, setPlStartDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [plEndDate, setPlEndDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const printRef = useRef<HTMLDivElement>(null);
  const { selectedBranchId } = useBranch();

  const { data: stockBalance = [], isLoading: stockLoading } = useQuery<StockBalanceItem[]>({
    queryKey: ["/api/reports/stock-balance"],
  });

  const cashFlowQueryKey = startDate || endDate 
    ? `/api/reports/daily-cash-flow?${new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }).toString()}`
    : "/api/reports/daily-cash-flow";

  const { data: cashFlow = [], isLoading: cashFlowLoading } = useQuery<DailyCashFlow[]>({
    queryKey: [cashFlowQueryKey],
  });

  const { data: customerReport = [], isLoading: customerLoading } = useQuery<CustomerReportItem[]>({
    queryKey: ["/api/reports/customer-report"],
  });

  const plQueryKey = plStartDate && plEndDate 
    ? `/api/reports/profit-loss?${new URLSearchParams({
        startDate: plStartDate,
        endDate: plEndDate,
        ...(selectedBranchId && { branchId: selectedBranchId.toString() }),
      }).toString()}`
    : null;

  const { data: profitLoss, isLoading: plLoading, refetch: refetchPL } = useQuery<ProfitLossReport>({
    queryKey: [plQueryKey],
    enabled: !!plQueryKey,
  });

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const stockTotals = stockBalance.reduce(
    (acc, item) => ({
      openingStock: acc.openingStock + (item.openingStock || 0),
      purchased: acc.purchased + item.purchased,
      sold: acc.sold + item.sold,
      balance: acc.balance + item.balance,
    }),
    { openingStock: 0, purchased: 0, sold: 0, balance: 0 }
  );

  const cashFlowTotals = cashFlow.reduce(
    (acc, day) => ({
      inAmount: acc.inAmount + day.inAmount,
      outAmount: acc.outAmount + day.outAmount,
      net: acc.net + day.net,
    }),
    { inAmount: 0, outAmount: 0, net: 0 }
  );

  const customerTotals = customerReport.reduce(
    (acc, customer) => ({
      totalSales: acc.totalSales + customer.totalSales,
      totalPayments: acc.totalPayments + customer.totalPayments,
      balance: acc.balance + customer.balance,
    }),
    { totalSales: 0, totalPayments: 0, balance: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" data-testid="heading-reports">Reports</h2>
          <p className="text-sm text-muted-foreground">
            View stock balance, cash flow, and customer reports
          </p>
        </div>
        <Button onClick={handlePrint} data-testid="button-print-report">
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="no-print grid w-full grid-cols-4" data-testid="tabs-report-type">
          <TabsTrigger value="stock" data-testid="tab-stock">
            <Package className="h-4 w-4 mr-2" />
            Available Stock
          </TabsTrigger>
          <TabsTrigger value="cashflow" data-testid="tab-cashflow">
            <Banknote className="h-4 w-4 mr-2" />
            Daily Cash Flow
          </TabsTrigger>
          <TabsTrigger value="customers" data-testid="tab-customers">
            <Users className="h-4 w-4 mr-2" />
            Customer Report
          </TabsTrigger>
          <TabsTrigger value="profitloss" data-testid="tab-profitloss">
            <Calculator className="h-4 w-4 mr-2" />
            Profit & Loss
          </TabsTrigger>
        </TabsList>

        <div ref={printRef}>
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Available Stock Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stockLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : stockBalance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No stock data available
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30%]">Item Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Purchased</TableHead>
                          <TableHead className="text-right">Sold</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockBalance.map((item, index) => (
                          <TableRow key={index} data-testid={`row-stock-${index}`}>
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="font-mono">
                                {item.openingStock || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary" className="font-mono">
                                {item.purchased}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary" className="font-mono">
                                {item.sold}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge 
                                variant={item.balance > 0 ? "default" : item.balance < 0 ? "destructive" : "secondary"}
                                className="font-mono"
                              >
                                {item.balance}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-semibold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{stockTotals.openingStock}</TableCell>
                          <TableCell className="text-right">{stockTotals.purchased}</TableCell>
                          <TableCell className="text-right">{stockTotals.sold}</TableCell>
                          <TableCell className="text-right">{stockTotals.balance}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Banknote className="h-5 w-5" />
                  Daily Cash Flow Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="no-print flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-40"
                      data-testid="input-start-date"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-40"
                      data-testid="input-end-date"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    data-testid="button-clear-dates"
                  >
                    Clear Dates
                  </Button>
                </div>

                {cashFlowLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : cashFlow.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No cash flow data available
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">IN (KWD)</TableHead>
                          <TableHead className="text-right">OUT (KWD)</TableHead>
                          <TableHead className="text-right">Net (KWD)</TableHead>
                          <TableHead className="text-right">Running Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cashFlow.map((day, index) => (
                          <TableRow key={index} data-testid={`row-cashflow-${index}`}>
                            <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                            <TableCell className="text-right">
                              <span className="text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {formatAmount(day.inAmount)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-red-600 dark:text-red-400 flex items-center justify-end gap-1">
                                <TrendingDown className="h-3 w-3" />
                                {formatAmount(day.outAmount)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={day.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                {day.net >= 0 ? "+" : ""}{formatAmount(day.net)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatAmount(day.runningBalance)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-semibold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right text-green-600 dark:text-green-400">
                            {formatAmount(cashFlowTotals.inAmount)}
                          </TableCell>
                          <TableCell className="text-right text-red-600 dark:text-red-400">
                            {formatAmount(cashFlowTotals.outAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cashFlowTotals.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                              {cashFlowTotals.net >= 0 ? "+" : ""}{formatAmount(cashFlowTotals.net)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {cashFlow.length > 0 && formatAmount(cashFlow[cashFlow.length - 1].runningBalance)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Customer Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customerLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : customerReport.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No customer data available
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Customer Name</TableHead>
                          <TableHead className="text-right">Total Sales (KWD)</TableHead>
                          <TableHead className="text-right">Total Payments (KWD)</TableHead>
                          <TableHead className="text-right">Balance Due (KWD)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerReport.map((customer) => (
                          <TableRow key={customer.customerId} data-testid={`row-customer-${customer.customerId}`}>
                            <TableCell className="font-medium">{customer.customerName}</TableCell>
                            <TableCell className="text-right font-mono">
                              {formatAmount(customer.totalSales)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatAmount(customer.totalPayments)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge 
                                variant={customer.balance > 0 ? "destructive" : customer.balance < 0 ? "default" : "secondary"}
                                className="font-mono"
                              >
                                {formatAmount(customer.balance)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-semibold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{formatAmount(customerTotals.totalSales)}</TableCell>
                          <TableCell className="text-right">{formatAmount(customerTotals.totalPayments)}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={customerTotals.balance > 0 ? "destructive" : customerTotals.balance < 0 ? "default" : "secondary"}
                            >
                              {formatAmount(customerTotals.balance)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitloss" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  Profit & Loss Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="no-print flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="pl-start-date">From Date</Label>
                    <Input
                      id="pl-start-date"
                      type="date"
                      value={plStartDate}
                      onChange={(e) => setPlStartDate(e.target.value)}
                      className="w-40"
                      data-testid="input-pl-start-date"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pl-end-date">To Date</Label>
                    <Input
                      id="pl-end-date"
                      type="date"
                      value={plEndDate}
                      onChange={(e) => setPlEndDate(e.target.value)}
                      className="w-40"
                      data-testid="input-pl-end-date"
                    />
                  </div>
                  <Button onClick={() => refetchPL()} data-testid="button-refresh-pl">
                    Refresh
                  </Button>
                </div>

                {plLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : profitLoss ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="p-0">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Gross Sales</div>
                          <div className="text-xl font-bold" data-testid="text-gross-sales">
                            {formatAmount(profitLoss.grossSales)} KWD
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            Returns: {formatAmount(profitLoss.saleReturns)} KWD
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="p-0">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Net Sales</div>
                          <div className="text-xl font-bold text-green-600" data-testid="text-net-sales">
                            {formatAmount(profitLoss.netSales)} KWD
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Gross Sales - Returns
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="p-0">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Cost of Goods Sold</div>
                          <div className="text-xl font-bold text-red-600" data-testid="text-cogs">
                            {formatAmount(profitLoss.costOfGoodsSold)} KWD
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Purchases - Purchase Returns
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="p-0">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Gross Profit</div>
                          <div className={`text-2xl font-bold ${profitLoss.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-gross-profit">
                            {formatAmount(profitLoss.grossProfit)} KWD
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Net Sales - COGS
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="p-0">
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Operating Expenses</div>
                          <div className="text-2xl font-bold text-orange-600" data-testid="text-total-expenses">
                            {formatAmount(profitLoss.totalExpenses)} KWD
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total from all categories
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-muted-foreground">Net Profit / (Loss)</div>
                        <div className={`text-3xl font-bold ${profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-net-profit">
                          {profitLoss.netProfit >= 0 ? '' : '('}{formatAmount(Math.abs(profitLoss.netProfit))}{profitLoss.netProfit >= 0 ? '' : ')'} KWD
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Gross Profit - Operating Expenses
                        </div>
                      </CardContent>
                    </Card>

                    {profitLoss.expensesByCategory.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Expenses Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Category</TableHead>
                                  <TableHead className="text-right">Amount (KWD)</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {profitLoss.expensesByCategory.map((expense, index) => (
                                  <TableRow key={index} data-testid={`row-expense-${index}`}>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell className="text-right font-mono">
                                      {formatAmount(expense.amount)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="bg-muted/50 font-semibold">
                                  <TableCell>Total Expenses</TableCell>
                                  <TableCell className="text-right font-mono">
                                    {formatAmount(profitLoss.totalExpenses)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a date range and click Refresh to generate the report
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            font-size: 12px;
          }
          .rounded-md {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
