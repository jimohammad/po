import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Truck, CreditCard, ExternalLink, Smartphone } from "lucide-react";
import type { SalesOrderWithDetails } from "@shared/schema";

interface SalesOrderDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SalesOrderWithDetails | null;
}

export function SalesOrderDetail({
  open,
  onOpenChange,
  order,
}: SalesOrderDetailProps) {
  if (!order) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (value: string | null, decimals: number) => {
    if (!value) return "—";
    return Number(value).toFixed(decimals);
  };

  const hasDocuments = order.invoiceFilePath || order.deliveryNoteFilePath || order.paymentReceiptFilePath;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle data-testid="dialog-title-so-detail">Sales Invoice Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sale Date</p>
              <p className="font-medium" data-testid="text-so-date">{formatDate(order.saleDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
              <p className="font-medium font-mono" data-testid="text-so-invoice">
                {order.invoiceNumber || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Customer</p>
            <p className="font-medium" data-testid="text-so-customer">
              {order.customer?.name || "—"}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground mb-2">Line Items</p>
            {order.lineItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items</p>
            ) : (
              <div className="space-y-3">
                {order.lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-md bg-muted/50"
                    data-testid={`item-row-${index}`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatNumber(item.priceKwd, 3)} KWD
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <p>{formatNumber(item.totalKwd, 3)} KWD</p>
                      </div>
                    </div>
                    {item.imeiNumbers && item.imeiNumbers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Smartphone className="h-3 w-3" />
                          <span>IMEI Numbers ({item.imeiNumbers.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.imeiNumbers.map((imei, imeiIndex) => (
                            <Badge 
                              key={imeiIndex} 
                              variant="secondary" 
                              className="text-xs font-mono"
                              data-testid={`imei-badge-${index}-${imeiIndex}`}
                            >
                              {imei}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Total (KWD)</p>
            <p className="text-lg font-semibold font-mono" data-testid="text-so-total-kwd">
              {formatNumber(order.totalKwd, 3)}
            </p>
          </div>

          {order.deliveryDate && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Delivery Date</p>
              <p className="font-medium" data-testid="text-so-delivery">{formatDate(order.deliveryDate)}</p>
            </div>
          )}

          {hasDocuments && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Attached Documents</p>
                <div className="flex flex-wrap gap-2">
                  {order.invoiceFilePath && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      data-testid="button-view-sales-invoice"
                    >
                      <a href={order.invoiceFilePath} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-1" />
                        Invoice
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {order.deliveryNoteFilePath && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      data-testid="button-view-sales-delivery"
                    >
                      <a href={order.deliveryNoteFilePath} target="_blank" rel="noopener noreferrer">
                        <Truck className="h-4 w-4 mr-1" />
                        Delivery Note
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {order.paymentReceiptFilePath && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      data-testid="button-view-payment-receipt"
                    >
                      <a href={order.paymentReceiptFilePath} target="_blank" rel="noopener noreferrer">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Payment Receipt
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
