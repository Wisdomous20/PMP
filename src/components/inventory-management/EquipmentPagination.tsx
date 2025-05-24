import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function EquipmentPagination({ currentPage, totalPages, onPageChange }: DataTablePaginationProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="sticky bottom-0 w-full bg-gradient-to-t from-yellow-100 to-transparent py-4 flex justify-center z-10 mt-4">
      <Pagination>
        <PaginationContent className="flex items-center gap-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md border bg-white shadow-sm hover:bg-gray-100 transition ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="font-semibold text-blue-900">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md border bg-white shadow-sm hover:bg-gray-100 transition ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
