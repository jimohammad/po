import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Pencil } from "lucide-react";
import type { Supplier } from "@shared/schema";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  suppliers: Supplier[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function SupplierDialog({
  open,
  onOpenChange,
  mode,
  suppliers,
  onAdd,
  onUpdate,
  onDelete,
}: SupplierDialogProps) {
  const [newSupplierName, setNewSupplierName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!open) {
      setNewSupplierName("");
      setEditingId(null);
      setEditingName("");
    }
  }, [open]);

  const handleAdd = () => {
    if (newSupplierName.trim()) {
      onAdd(newSupplierName.trim());
      setNewSupplierName("");
      if (mode === "add") {
        onOpenChange(false);
      }
    }
  };

  const handleStartEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditingName(supplier.name);
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
          <DialogTitle data-testid="dialog-title-supplier">
            {mode === "add" ? "Add New Supplier" : "Manage Suppliers"}
          </DialogTitle>
        </DialogHeader>

        {mode === "add" ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Supplier Name</Label>
              <Input
                id="supplier-name"
                data-testid="input-supplier-name"
                placeholder="Enter supplier name"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Add New Supplier</Label>
              <div className="flex gap-2">
                <Input
                  data-testid="input-new-supplier-name"
                  placeholder="Enter supplier name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button onClick={handleAdd} size="sm" data-testid="button-add-supplier-quick">
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Existing Suppliers</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {suppliers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No suppliers yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {suppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                      >
                        {editingId === supplier.id ? (
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8"
                              data-testid={`input-edit-supplier-${supplier.id}`}
                            />
                            <Button size="sm" onClick={handleSaveEdit} data-testid={`button-save-supplier-${supplier.id}`}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm" data-testid={`text-supplier-${supplier.id}`}>
                              {supplier.name}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleStartEdit(supplier)}
                                data-testid={`button-edit-supplier-${supplier.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onDelete(supplier.id)}
                                data-testid={`button-delete-supplier-${supplier.id}`}
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
              <Button onClick={handleAdd} data-testid="button-save-supplier">
                Add Supplier
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
