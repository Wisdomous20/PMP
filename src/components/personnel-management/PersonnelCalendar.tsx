"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import CalendarView from "./CalendarView";

interface PersonnelCalendarProps {
  person: Personnel;
  openUpdateDialog?: (person: Personnel) => void;
  onDelete?: (personId: string) => void;
  buttonOnly?: boolean;
}

export default function PersonnelCalendar({
  person,
  openUpdateDialog,
  onDelete,
  buttonOnly = false,
}: PersonnelCalendarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const openCalendarDirectly = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      setCalendarOpen(true);
    }, 0);
  };

  if (buttonOnly) {
    return (
      <>
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-colors flex items-center justify-center"
          onClick={openCalendarDirectly}
          title="View Calendar"
        >
          <Calendar className="w-4 h-4" />
        </button>

        {calendarOpen && (
          <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-scroll">
              <CalendarView tasks={person.tasks} personName={person.name} />
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_60px] items-center gap-4 border-b bg-gray-300 border-gray-300 rounded-md shadow-md mb-2 p-4">
      <div className="text-center">
        <p>{person.name}</p>
      </div>
      <div className="text-center">
        <p>{person.position}</p>
      </div>
      <div className="text-center">
        <p>{person.department}</p>
      </div>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-200 cursor-pointer transition-colors flex items-center justify-center"
          onClick={openCalendarDirectly}
          title="View Calendar"
        >
          <Calendar className="w-4 h-4" />
        </button>

        {calendarOpen && (
          <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-scroll">
              <CalendarView tasks={person.tasks} personName={person.name} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
