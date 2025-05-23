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
import { PlusCircle } from "lucide-react";
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
    page: 1
  });
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadEquipment = useCallback(async (filterOverrides?: Partial<FilterState>) => {
    try {
      setLoading(true);

      const effectiveFilters = { ...filters, ...filterOverrides };
      
      const response = await fetchPaginatedEquipment({
        page: effectiveFilters.page,
        pageSize: ITEMS_PER_PAGE,
        department: effectiveFilters.department === "all" ? undefined : effectiveFilters.department,
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
  }, [filters, departments.length]);

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
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
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
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-3">
        <div className="flex items-center gap-2">
          <Select
            value={filters.department}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-[180px]">
              <Filter size={16} />
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
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
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
        
        {userRole === "ADMIN" && (
          <div className="flex gap-2">
            <Button onClick={downloadPDF}>Download PDF</Button>
            <Button
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Qty</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Brand/Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Date Purchased</TableHead>
              <TableHead>Date Recieved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Department</TableHead>
              {(userRole === "ADMIN" || userRole === "SECRETARY") && (
                <TableHead>Actions</TableHead>
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
                      : "No equipment found"
                  }
                </TableCell>
              </TableRow>
            ) : (
              equipment.map((item: Equipment, index: number) => (
                <TableRow key={item.id}>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.unitCost}</TableCell>
                  <TableCell>{item.totalCost}</TableCell>
                  <TableCell>
                    {new Date(item.datePurchased).toDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.dateReceived).toDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.department}</TableCell>

                  <TableCell>
                    {(userRole === "ADMIN" || userRole === "SECRETARY") && (
                      <div className="flex space-x-2">
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
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EquipmentPagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}