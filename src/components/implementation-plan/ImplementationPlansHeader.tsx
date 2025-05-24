import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImplementationPlansHeaderProps {
  onSearchChange: (query: string) => void;
  loading?: boolean;
}

const ImplementationPlansHeader: React.FC<ImplementationPlansHeaderProps> = ({
  onSearchChange,
  loading = false,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        {loading ? (
          <Skeleton className="h-6 w-[250px] rounded-md" />
        ) : (
          <h1 className="text-2xl font-bold text-indigo-dark tracking-tight">
            Implementation Plans
          </h1>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {loading ? (
          <Skeleton className="h-5 w-[300px] rounded-md" />
        ) : (
          <p className="text-muted-foreground">
            Manage and track all implementation plans across different stages
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            {loading ? (
              <Skeleton className="h-9 w-full md:w-[200px] lg:w-[250px] rounded-md" />
            ) : (
              <>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  className="w-full pl-8 md:w-[200px] lg:w-[250px] h-9"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationPlansHeader;
