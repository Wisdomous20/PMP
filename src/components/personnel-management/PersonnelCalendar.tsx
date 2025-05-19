"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Pencil, Trash, Calendar } from "lucide-react";
import CalendarView from "./CalendarView";
import {
  Dialog as ConfirmDialog,
  DialogTrigger as ConfirmDialogTrigger,
  DialogContent as ConfirmDialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PersonnelCalendarProps {
  person: Personnel;
  openUpdateDialog: (person: Personnel) => void;
  onDelete?: (personId: string) => void;
}

export default function PersonnelCalendar({
  person,
  openUpdateDialog,
  onDelete,
}: PersonnelCalendarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(person.id);
    }
    setDeleteDialogOpen(false);
  };

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
        {/* Calendar Dialog */}
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogTrigger asChild>
            <Calendar
              className="w-4 h-4 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                setCalendarOpen(true);
              }}
            />
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-scroll">
            <CalendarView tasks={person.tasks} personName={person.name} />
          </DialogContent>
        </Dialog>
        {/* Edit */}
        <Pencil
          className="w-4 h-4 cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            openUpdateDialog(person);
          }}
        />
        {/* Delete */}
        <ConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <ConfirmDialogTrigger asChild>
            <Trash
              className="w-4 h-4 text-red-600 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            />
          </ConfirmDialogTrigger>
          <ConfirmDialogContent>
            <DialogHeader>
              <DialogTitle>Delete Personnel</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <b>{person.name}</b>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </ConfirmDialogContent>
        </ConfirmDialog>
      </div>
    </div>
  );
}