import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingPath?: string | null;
  testId: string;
}

export function FileUploadField({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  value,
  onChange,
  existingPath,
  testId,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    onChange(file);
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (ext === 'pdf') return <FileText className="h-4 w-4" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        data-testid={`${testId}-input`}
      />
      
      {value ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          {getFileIcon(value.name)}
          <span className="flex-1 text-sm truncate">{value.name}</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
            data-testid={`${testId}-clear`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : existingPath ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-muted-foreground truncate">Existing file attached</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClick}
            data-testid={`${testId}-replace`}
          >
            Replace
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="w-full justify-start gap-2 h-auto py-2.5 text-sm font-normal text-muted-foreground"
          data-testid={`${testId}-upload`}
        >
          <Upload className="h-4 w-4" />
          <span>Choose file (PDF, JPG, PNG)</span>
        </Button>
      )}
    </div>
  );
}
