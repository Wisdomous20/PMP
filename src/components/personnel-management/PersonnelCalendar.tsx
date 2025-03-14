"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import CalendarView from "./CalendarView";

interface PersonnelCalendarProps {
  person: Personnel;
  openUpdateDialog: (person: Personnel) => void;
}

export default function PersonnelCalendar({
  person,
  openUpdateDialog,
}: PersonnelCalendarProps) {
  return (
    <Dialog>
      {/* Wrap the personnel row as the trigger */}
      <DialogTrigger asChild>
        <div
          className="bg-gray-300 border border-gray-300 rounded-md shadow-md mb-4 p-4 grid grid-cols-[1fr_1fr_1fr_30px] items-center gap-4 cursor-pointer"
        >
          <div className="text-center">
            <p>{person.name}</p>
          </div>
          <div className="text-center">
            <p>{person.position}</p>
          </div>
          <div className="text-center">
            <p>{person.department}</p>
          </div>
          <div className="flex justify-center">
            <Pencil
              className="w-4 h-4"
              onClick={(e) => {
                e.stopPropagation();
                openUpdateDialog(person);
              }}
            />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-scroll">
        <CalendarView tasks={person.tasks} personName={person.name}/>
      </DialogContent>
    </Dialog>
  );
}
