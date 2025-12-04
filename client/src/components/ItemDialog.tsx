import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Pencil } from "lucide-react";
import type { Item } from "@shared/schema";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  items: Item[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function ItemDialog({
  open,
  onOpenChange,
  mode,
  items,
  onAdd,
  onUpdate,
  onDelete,
}: ItemDialogProps) {
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!open) {
      setNewItemName("");
      setEditingId(null);
      setEditingName("");
    }
  }, [open]);

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName("");
      if (mode === "add") {
        onOpenChange(false);
      }
    }
  };

  const handleStartEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle data-testid="dialog-title-item">
            {mode === "add" ? "Add New Item" : "Manage Items"}
          </DialogTitle>
        </DialogHeader>

        {mode === "add" ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                data-testid="input-item-name"
                placeholder="Enter item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Add New Item</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="input-new-item-name"
                  placeholder="Enter item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button onClick={handleAdd} size="sm" data-testid="button-add-item-quick">
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Existing Items</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No items yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                      >
                        {editingId === item.id ? (
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8"
                              data-testid={`input-edit-item-${item.id}`}
                            />
                            <Button size="sm" onClick={handleSaveEdit} data-testid={`button-save-item-${item.id}`}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm" data-testid={`text-item-${item.id}`}>
                              {item.name}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleStartEdit(item)}
                                data-testid={`button-edit-item-${item.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onDelete(item.id)}
                                data-testid={`button-delete-item-${item.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        <DialogFooter>
          {mode === "add" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} data-testid="button-save-item">
                Add Item
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
