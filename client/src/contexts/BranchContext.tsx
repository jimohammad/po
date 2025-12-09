import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface Branch {
  id: number;
  name: string;
  code: string | null;
  isDefault: number | null;
}

interface BranchContextType {
  currentBranchId: number | null;
  setCurrentBranchId: (branchId: number) => void;
  currentBranch: Branch | undefined;
  branches: Branch[];
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [currentBranchId, setCurrentBranchIdState] = useState<number | null>(() => {
    const saved = localStorage.getItem("selectedBranchId");
    return saved ? parseInt(saved) : null;
  });

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  const { data: defaultBranch } = useQuery<Branch | null>({
    queryKey: ["/api/branches/default"],
    enabled: currentBranchId === null,
  });

  useEffect(() => {
    if (currentBranchId === null && defaultBranch) {
      setCurrentBranchIdState(defaultBranch.id);
      localStorage.setItem("selectedBranchId", defaultBranch.id.toString());
    }
  }, [defaultBranch, currentBranchId]);

  useEffect(() => {
    if (currentBranchId === null && branches.length > 0 && !defaultBranch) {
      const defaultBr = branches.find((b) => b.isDefault === 1) || branches[0];
      if (defaultBr) {
        setCurrentBranchIdState(defaultBr.id);
        localStorage.setItem("selectedBranchId", defaultBr.id.toString());
      }
    }
  }, [branches, currentBranchId, defaultBranch]);

  const setCurrentBranchId = (branchId: number) => {
    setCurrentBranchIdState(branchId);
    localStorage.setItem("selectedBranchId", branchId.toString());
  };

  const currentBranch = branches.find((b) => b.id === currentBranchId);

  return (
    <BranchContext.Provider
      value={{
        currentBranchId,
        setCurrentBranchId,
        currentBranch,
        branches,
        isLoading,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
