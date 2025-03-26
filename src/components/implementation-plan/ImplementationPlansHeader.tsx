import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";

const ImplementationPlansHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Implementation Plans</h1>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground">
          Manage and track all implementation plans across different stages
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search plans..."
              className="w-full pl-8 md:w-[200px] lg:w-[250px] h-9"
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px] h-9">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-1" />
              New Plan
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImplementationPlansHeader;
