/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddEquipment from "@/components/inventory-management/addEquipment";
import { DeleteEquipment } from "./DeleteEquipment";
import { EditEquipment } from "./EditEquipment";
import { useSession } from "next-auth/react";
import getUserRoleFetch from "@/domains/user-management/services/getUserRoleFetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EquipmentPagination from "./EquipmentPagination";
import fetchPaginatedEquipment from "@/domains/inventory-management/services/fetchPaginatedEquipment";
import fetchDepartment from "@/domains/inventory-management/services/fetchDepartment";
import { createInventoryExcel } from "@/domains/inventory-management/services/createinventoryExcel";

const ITEMS_PER_PAGE = 50;

interface FilterState {
  department: string;
  page: number;
}

export default function InventoryManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<UserRole>();
  const [departments, setDepartments] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    department: "all",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadEquipment = useCallback(
    async (filterOverrides?: Partial<FilterState>) => {
      try {
        setLoading(true);

        const effectiveFilters = { ...filters, ...filterOverrides };

        const response = await fetchPaginatedEquipment({
          page: effectiveFilters.page,
          pageSize: ITEMS_PER_PAGE,
          department:
            effectiveFilters.department === "all"
              ? undefined
              : effectiveFilters.department,
        });

        const { data: paginatedData, meta } = response;
        setEquipment(paginatedData);
        setTotalItems(meta.total);
        setTotalPages(meta.pageCount);

        if (effectiveFilters.page === 1 && departments.length === 0) {
          const deptList = await fetchDepartment();
          setDepartments(deptList);
        }
      } catch (error) {
        console.error("Failed to load equipment:", error);
        setEquipment([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [filters, departments.length]
  );

  const loadUserRole = useCallback(async () => {
    try {
      if (session?.user?.id) {
        const { userRole } = await getUserRoleFetch(session.user.id);
        setUserRole(userRole as UserRole);
      }
    } catch (error) {
      console.error("Failed to load user role:", error);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session) {
      loadEquipment();
    }
  }, [filters, session, loadEquipment]);

  useEffect(() => {
    loadUserRole();
  }, [loadUserRole]);

  const handleDepartmentChange = (value: string) => {
    setFilters({
      department: value,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleEquipmentDeleted = async () => {
    const remainingItems = totalItems - 1;
    const maxPage = Math.ceil(remainingItems / ITEMS_PER_PAGE) || 1;

    if (filters.page > maxPage) {
      const newFilters = { ...filters, page: maxPage };
      setFilters(newFilters);
      await loadEquipment(newFilters);
    } else {
      await loadEquipment();
    }
  };

  const handleEquipmentAdded = async () => {
    setIsDialogOpen(false);
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    await loadEquipment(newFilters);
  };

  const handleEquipmentUpdated = async () => {
    await loadEquipment();
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    let title = "Equipment Report";
    if (filters.department !== "all") {
      title += ` - ${filters.department} Department`;
    }

    doc.text(title, 14, 10);

    const tableColumnHeaders = [
      "Qty",
      "Description",
      "Brand/Model",
      "Serial Number",
      "Supplier",
      "Unit Cost",
      "Total Cost",
      "Date Purchased",
      "Date Received",
      "Status",
      "Location",
      "Department",
    ];

    const tableRows = equipment.map((item) => [
      item.quantity,
      item.description,
      item.brand,
      item.serialNumber,
      item.supplier,
      item.unitCost.toFixed(2),
      item.totalCost.toFixed(2),
      new Date(item.datePurchased).toLocaleDateString(),
      new Date(item.dateReceived).toLocaleDateString(),
      item.status,
      item.location,
      item.department,
    ]);

    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
    });

    doc.save("equipment-report.pdf");
  };

  if (isLoading && equipment.length === 0) {
    return (
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
        <Skeleton className="h-8 w-72 -mt-8 mb-6 shrink-0" />
        <div className="flex justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-32 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="rounded-md border">
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pl-4 pr-8 pt-8 pb-8 relative flex flex-col w-full h-full">
      <h1 className="text-2xl font-semibold -mt-4 mb-6 text-indigo-dark">
        Inventory Report Summary
      </h1>

      <div className="flex justify-between items-center mb-4 pt-3">
        <div className="flex items-center gap-3">
          <Select
            value={filters.department}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-[240px] bg-white flex items-center gap-2">
              <span className="flex-shrink-0">
                <Filter size={16} />
              </span>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.isArray(departments) &&
                departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {userRole === "ADMIN" && (
            <div className="flex gap-2">
              <Button
                onClick={downloadPDF}
                className="bg-orange-600 hover:bg-orange-800"
              >
                Download PDF
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-800"
                onClick={() =>
                  createInventoryExcel(
                    filters.department === "all"
                      ? "ALL DEPARTMENTS"
                      : filters.department,
                    new Date(),
                    equipment
                  )
                }
              >
                Download Excel
              </Button>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-Background hover:bg-indigo-900">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <AddEquipment onSuccess={handleEquipmentAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full">
        <div className="w-full rounded-md border shadow-sm bg-gray-100 overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-yellow-500 hover:bg-yellow-500">
              <TableRow className="h-16 border-b-0 bg-yellow-500 hover:bg-yellow-500">
                <TableHead className="w-[40px] text-left text-indigo-dark font-semibold">
                  Qty
                </TableHead>
                <TableHead className="w-[200px] break-words text-indigo-dark font-semibold">
                  Description
                </TableHead>
                <TableHead className="w-[120px] break-words text-indigo-dark font-semibold">
                  Brand/Model
                </TableHead>
                <TableHead className="w-[90px] break-words text-indigo-dark font-semibold">
                  Serial Number
                </TableHead>
                <TableHead className="w-[96px] break-words text-indigo-dark font-semibold">
                  Supplier
                </TableHead>
                <TableHead className="w-[60px] text-indigo-dark font-semibold">
                  Unit Cost
                </TableHead>
                <TableHead className="w-[60px] text-indigo-dark font-semibold">
                  Total Cost
                </TableHead>
                <TableHead className="w-[100px] text-indigo-dark font-semibold">
                  Date Purchased
                </TableHead>
                <TableHead className="w-[100px] text-indigo-dark font-semibold">
                  Date Received
                </TableHead>
                <TableHead className="w-[100px] text-indigo-dark font-semibold">
                  Status
                </TableHead>
                <TableHead className="w-[100px] break-words text-indigo-dark font-semibold">
                  Location
                </TableHead>
                <TableHead className="w-[120px] break-words text-indigo-dark font-semibold">
                  Department
                </TableHead>
                {(userRole === "ADMIN" || userRole === "SECRETARY") && (
                  <TableHead className="w-[40px]"></TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {isLoading
                      ? "Loading..."
                      : filters.department !== "all"
                      ? "No equipment found for this department"
                      : "No equipment found"}
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((item: Equipment, index: number) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-12">{item.quantity}</TableCell>
                    <TableCell className="w-[250px] break-words">
                      {item.description}
                    </TableCell>
                    <TableCell className="w-[200px] break-words">
                      {item.brand}
                    </TableCell>
                    <TableCell className="w-[200px] break-words">
                      {item.serialNumber}
                    </TableCell>
                    <TableCell className="w-[180px] break-words">
                      {item.supplier}
                    </TableCell>
                    <TableCell className="w-[120px]">{item.unitCost}</TableCell>
                    <TableCell className="w-[120px]">
                      {item.totalCost}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      {new Date(item.datePurchased).toDateString()}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      {new Date(item.dateReceived).toDateString()}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="w-[180px] break-words">
                      {item.location}
                    </TableCell>
                    <TableCell className="w-[180px] break-words">
                      {item.department}
                    </TableCell>
                    {(userRole === "ADMIN" || userRole === "SECRETARY") && (
                      <TableCell className="w-[40px]">
                        <div className="flex flex-col space-y-1 items-center">
                          <EditEquipment
                            equipment={item}
                            onUpdate={handleEquipmentUpdated}
                          />
                          <DeleteEquipment
                            equipmentId={item.id}
                            description={item.description}
                            onDelete={handleEquipmentDeleted}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <EquipmentPagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
