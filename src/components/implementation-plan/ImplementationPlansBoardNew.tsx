"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import ImplementationPlanCardComponent from "./ImplementationPlanCard" // Renamed to avoid conflict
import ImplementationPlanModal from "./ImplementationPlanModal"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import useGetImplementationPlans from "@/domains/implementation-plan/hooks/useGetImplementationPlans"
import fetchUpdateImplementationPlan from "@/domains/implementation-plan/services/fetchUpdateImplementationPlan";

export type FrontendTask = {
  id: string
  title: string
  completed: boolean
  startTime: string
  endTime: string
  assignee: string
}

export type ImplementationPlanCard = {
  id: string
  serviceRequestId: string
  concern: string
  description: string
  tasks: FrontendTask[]
}

type ServerPersonnel = {
  id: string;
  name: string;
};

type ServerPersonnelAssignment = {
  id: string;
  personnelId: string;
  taskId: string;
  personnel: ServerPersonnel;
};

type ServerTaskForUpdate = {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  checked: boolean;
};

type ServerTaskFromGet = {
  id: string;
  name: string;
  checked: boolean;
  startTime: string | Date;
  endTime: string | Date;
  assignments: ServerPersonnelAssignment[];
};

type ServerServiceRequest = {
  id: string;
  concern: string;
  details: string;
};

type ServerImplementationPlan = {
  id: string;
  description: string;
  status: string;
  serviceRequestId: string;
  serviceRequest: ServerServiceRequest;
  tasks: ServerTaskFromGet[];
  createdAt: string | Date;
};


export default function ImplementationPlansBoardNew() {
  const { toast } = useToast()
  const [cards, setCards] = useState<ImplementationPlanCard[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState<ImplementationPlanCard | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [filterAssignees, setFilterAssignees] = useState<string[]>([])

  const { implementationPlans: rawImplementationPlans, loading, error: fetchError } = useGetImplementationPlans();

  const teamMembers = ["Alex Chen", "Sarah Johnson", "Michael Wong", "Emily Davis", "Jordan Smith", "Taylor Brown"]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === "Escape" && showSearch) {
        setShowSearch(false)
        setSearchTerm("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSearch])

  useEffect(() => {
    if (!loading && rawImplementationPlans) {
      setCards(rawImplementationPlans);
    }
    if (fetchError) {
      toast({
        title: "Error fetching plans",
        description: fetchError || "Could not load implementation plans.",
        variant: "destructive"
      })
    }
  }, [loading, rawImplementationPlans, fetchError, toast]);

  const handleCardClick = (card: ImplementationPlanCard) => {
    setCurrentCard(card)
    setIsModalOpen(true)
  }

  const handleSaveCard = async (updatedCardFromModal: ImplementationPlanCard) => {
    if (!updatedCardFromModal.serviceRequestId) {
      toast({
        title: "Save Error",
        description: "Service Request ID is missing. Cannot update plan.",
        variant: "destructive",
      });
      setIsModalOpen(false);
      return;
    }

    const tasksToSave: ServerTaskForUpdate[] = updatedCardFromModal.tasks.map(ft => ({
      id: ft.id,
      name: ft.title,
      checked: ft.completed,
      startTime: new Date(ft.startTime),
      endTime: new Date(ft.endTime),
    }));

    try {
      const serverUpdatedPlan: ServerImplementationPlan = await fetchUpdateImplementationPlan(
        updatedCardFromModal.serviceRequestId,
        tasksToSave
      );

      console.log(serverUpdatedPlan)

      const newCardState: ImplementationPlanCard = {
        id: serverUpdatedPlan.id,
        serviceRequestId: serverUpdatedPlan.serviceRequestId,
        concern: serverUpdatedPlan.serviceRequest?.concern || updatedCardFromModal.concern,
        description: serverUpdatedPlan.description,
        tasks: serverUpdatedPlan.tasks.map((st: ServerTaskFromGet) => {
          const firstAssignment = st.assignments?.[0];
          const assigneeName = firstAssignment?.personnel?.name || "Unassigned";
          return {
            id: st.id,
            title: st.name,
            completed: st.checked,
            startTime: st.startTime ? new Date(st.startTime).toISOString().slice(0, 16) : "",
            endTime: st.endTime ? new Date(st.endTime).toISOString().slice(0, 16) : "",
            assignee: assigneeName,
          };
        })
      };

      setCards(cards.map((card) => (card.id === newCardState.id ? newCardState : card)));
      toast({
        title: "Plan Updated",
        description: `Plan "${newCardState.concern}" has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update implementation plan:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not update the plan.",
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
      setCurrentCard(null);
    }
  };

  const allAssignees = Array.from(new Set(cards.flatMap((card) => card.tasks.map((task) => task.assignee)))).filter(Boolean).filter(assignee => assignee !== "Unassigned");

  const filterCards = (cardsToFilter: ImplementationPlanCard[]) => {
    return cardsToFilter.filter((card) => {
      const matchesSearch =
        searchTerm === "" ||
        card.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tasks.some(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignee?.toLowerCase().includes(searchTerm.toLowerCase()), // Added optional chaining for assignee
        )

      const matchesAssignee =
        filterAssignees.length === 0 || card.tasks.some((task) => filterAssignees.includes(task.assignee))

      return matchesSearch && matchesAssignee
    })
  }

  const pendingCards = filterCards(cards.filter((card) => card.tasks.every((task) => !task.completed))) // Changed logic: all tasks must be incomplete
  const inProgressCards = filterCards(
    cards.filter((card) => card.tasks.some((task) => task.completed) && !card.tasks.every((task) => task.completed)),
  )
  const doneCards = filterCards(
    cards.filter((card) => card.tasks.length > 0 && card.tasks.every((task) => task.completed)),
  )

  const getInitials = (name: string = "") => { // Added default value for name
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "N/A"
  }

  return (
    <div className="space-y-4 w-full h-full p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search plans and tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 pl-8"
                autoFocus
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowSearch(true)}>
              <Search className="h-4 w-4 mr-1" /> Search
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
                {filterAssignees.length > 0 && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filterAssignees.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allAssignees.length > 0 ? allAssignees.map((assignee) => (
                <DropdownMenuCheckboxItem
                  key={assignee}
                  checked={filterAssignees.includes(assignee)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilterAssignees([...filterAssignees, assignee])
                    } else {
                      setFilterAssignees(filterAssignees.filter((a) => a !== assignee))
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback className="text-[10px]">{getInitials(assignee)}</AvatarFallback>
                    </Avatar>
                    {assignee}
                  </div>
                </DropdownMenuCheckboxItem>
              )) : <DropdownMenuLabel className="text-xs text-gray-500 px-2">No assignees found</DropdownMenuLabel>}

              {filterAssignees.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={() => setFilterAssignees([])}
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Pending</h2>
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium">{pendingCards.length}</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-3 flex-1 overflow-y-auto min-h-[60vh]">
            {pendingCards.map((card) => (
              <ImplementationPlanCardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
            {pendingCards.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">No pending plans</div>}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">In Progress</h2>
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">{inProgressCards.length}</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-3 flex-1 overflow-y-auto min-h-[60vh]">
            {inProgressCards.map((card) => (
              <ImplementationPlanCardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
            {inProgressCards.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">No plans in progress</div>}
          </div>
        </div>

        {/* Done Column */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Done</h2>
            <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">{doneCards.length}</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-3 flex-1 overflow-y-auto min-h-[60vh]">
            {doneCards.map((card) => (
              <ImplementationPlanCardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
            {doneCards.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">No completed plans</div>}
          </div>
        </div>
      </div>

      {isModalOpen && currentCard && (
        <ImplementationPlanModal
          card={currentCard}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setCurrentCard(null); }}
          onSave={handleSaveCard}
          teamMembers={teamMembers}
        />
      )}
    </div>
  )
}