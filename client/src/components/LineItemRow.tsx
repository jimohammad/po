import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { Item } from "@shared/schema";

export interface LineItemData {
  id: string;
  itemName: string;
  quantity: number;
  priceKwd: string;
  fxPrice: string;
  totalKwd: string;
}

interface LineItemRowProps {
  item: LineItemData;
  items: Item[];
  index: number;
  onChange: (id: string, field: keyof LineItemData, value: string | number) => void;
  onRemove: (id: string) => void;
}

export function LineItemRow({
  item,
  items,
  index,
  onChange,
  onRemove,
}: LineItemRowProps) {
  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value) || 0;
    onChange(item.id, "quantity", qty);
  };

  const handlePriceChange = (value: string) => {
    onChange(item.id, "priceKwd", value);
  };

  const handleFxPriceChange = (value: string) => {
    onChange(item.id, "fxPrice", value);
  };

  return (
    <tr className="border-t border-border" data-testid={`line-item-row-${index}`}>
      <td className="px-3 py-1.5">
        <Select
          value={item.itemName || "none"}
          onValueChange={(val) => onChange(item.id, "itemName", val === "none" ? "" : val)}
        >
          <SelectTrigger className="w-full text-sm" data-testid={`select-item-${index}`}>
            <SelectValue placeholder="Select item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-- Select item --</SelectItem>
            {items.map((itm) => (
              <SelectItem key={itm.id} value={itm.name}>
                {itm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-1 py-1.5 text-center">
        <Input
          type="number"
          min="0"
          step="1"
          value={item.quantity || ""}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="text-center text-sm"
          data-testid={`input-qty-${index}`}
        />
      </td>
      <td className="px-1 py-1.5 text-center">
        <Input
          type="number"
          min="0"
          step="0.001"
          value={item.priceKwd}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="text-center text-sm"
          data-testid={`input-price-${index}`}
        />
      </td>
      <td className="px-1 py-1.5 text-center">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.fxPrice}
          onChange={(e) => handleFxPriceChange(e.target.value)}
          className="text-center text-sm"
          data-testid={`input-fxprice-${index}`}
        />
      </td>
      <td className="px-1 py-1.5 text-center">
        <Input
          type="number"
          readOnly
          value={item.totalKwd || "0.000"}
          className="text-center text-sm bg-muted/50"
          data-testid={`input-total-${index}`}
        />
      </td>
      <td className="px-3 py-1.5 text-center">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onRemove(item.id)}
          data-testid={`button-remove-item-${index}`}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </td>
    </tr>
  );
}
