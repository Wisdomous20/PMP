"use client"

import { useState } from "react";
import { Archive, FileText, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LeftTab() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative h-screen transition-all duration-300 ${isOpen ? "w-64" : "w-8"}`}>
      <Card className={`h-full rounded-l-none ${isOpen ? "w-64" : "w-8"}`}>
        {isOpen && (
          <>
            <CardHeader className="flex flex-col items-center space-y-2 pb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User avatar" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">Name</h2>
                <p className="text-sm text-muted-foreground">Department</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create SR
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Requests
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            </CardContent>
          </>
        )}
        <Button
          className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft size={16} className="text-black"/> : <ChevronRight size={16} className="text-black"/>}
        </Button>
      </Card>
    </div>
  );
}
