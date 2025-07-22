"use client";

import AddEquipment from "@/components/inventory-management/addEquipment";
import autoTable from "jspdf-autotable";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {DeleteEquipment} from "./DeleteEquipment";
import {EditEquipment} from "./EditEquipment";
import type {EquipmentObject} from "@/lib/types/InventoryManagementTypes";
import * as equipmentObjectExtensions from "@/lib/types/InventoryManagementTypesHelpers";
import EquipmentPagination from "./EquipmentPagination";
import * as equipmentManagement from "@/lib/equipments/get-equipments";
import {ErrorCodes} from "@/lib/ErrorCodes";
import * as ExcelExporters from "@/lib/exports/ExcelExporters";
import {Filter, Plus} from "lucide-react";
import {ITEMS_PER_PAGE, OFFICES} from "@/lib/constants/EquipmentPageConstants";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {StatusBadge} from "./StatusBadge";
import {jsPDF} from "jspdf";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";

interface FilterState {
  office: string;
  page: number;
}

export default function InventoryManagement() {
  const [equipment, setEquipment] = useState<EquipmentObject[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const [userRole, setUserRole] = useState<UserRole>();
  const [userDepartment, setUserDepartment] = useState<string>("");
  const [offices, setOffices] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    office: "",
    page: 1,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isOfficeFilterDisabled, setIsOfficeFilterDisabled] = useState(false); // New state

  const loadEquipment = useCallback(
    async (filterOverrides?: Partial<FilterState>) => {
      setLoading(true);

      const effectiveFilters = { ...filters, ...filterOverrides };
      const result = await equipmentManagement.getAllEquipments({
        page: effectiveFilters.page,
        pageSize: ITEMS_PER_PAGE,
        department:
          effectiveFilters.office === "all"
            ? undefined
            : effectiveFilters.office,
      });

      // Check if the result is empty
      if (result.code !== ErrorCodes.OK || !result.data) {
        setEquipment([]);
        setTotalItems(0);
        setTotalPages(1);
        setLoading(false);

        return;
      }

      // Map these values
      const equipments = result.data.result
        .map(equipmentObjectExtensions.toEquipmentObjectArray);

      // Assign
      setEquipment(equipments);
      setTotalItems(result.data.total);
      setTotalPages(result.data.totalPages);

      if (effectiveFilters.page === 1 && offices.length === 0) {
        setOffices(OFFICES);
      }

      setLoading(false);
    },
    [filters, offices.length]
  );

  useEffect(() => {
    if (session && session.data) {
      setUserRole(session?.data?.user.role as UserRole);
      setUserDepartment(session?.data?.user.department);

      if (session?.data?.user.role === "SUPERVISOR") {
        setFilters({ office: session?.data?.user.department, page: 1 });
        setIsOfficeFilterDisabled(true); // Disable filter for SUPERVISOR
      } else {
        setFilters({ office: "all", page: 1 });
        setIsOfficeFilterDisabled(false); // Enable for other roles
      }
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      // Only load equipment if a user role is determined or if it's not a supervisor
      // For supervisors, the loadEquipment will be triggered by the filter change in loadUserRoleAndDepartment
      if (userRole && userRole !== "SUPERVISOR") {
        loadEquipment();
      } else if (userRole === "SUPERVISOR" && filters.office !== "all") { // Ensure supervisor's department filter is set
        loadEquipment();
      } else if (!userRole && filters.office === "all") { // Initial load for non-supervisors or if a role not yet fetched
         loadEquipment();
      }
    }
  }, [filters, session, loadEquipment, userRole]);

  const handleOfficeChange = (value: string) => {
    if (isOfficeFilterDisabled) return; // Prevent change if disabled
    setFilters({ office: value, page: 1 });
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
    // If supervisor, keep their department filter, otherwise reset to 'all' or keep current if admin wants to add to specific
    const newPage = 1;
    if (userRole === "SUPERVISOR") {
        setFilters(prev => ({...prev, page: newPage}));
        await loadEquipment({...filters, page: newPage});
    } else {
        const newFilters = { ...filters, page: newPage }; // Or consider resetting office to 'all' if desired
        setFilters(newFilters);
        await loadEquipment(newFilters);
    }
  };

  const handleEquipmentUpdated = async () => {
    await loadEquipment();
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    let title = "Equipment Report";
    if (filters.office !== "all") {
      title += ` - ${filters.office} Office`;
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
      "Office",
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

  if (isLoading && equipment.length === 0 && !userDepartment) {
    return (
      <div className="fixed top-0 right-0 bottom-0 left-24 flex flex-col pl-4 pr-8 pt-8 pb-8 bg-gradient-to-b from-yellow-50 to-blue-50">
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
    <div className="fixed top-0 right-0 bottom-0 left-24 flex flex-col pl-4 pr-8 pt-8 pb-8">
      <h1 className="text-2xl font-semibold -mt-4 mb-6 text-indigo-dark flex-shrink-0">
        Inventory Report Summary
      </h1>

      <div className="flex justify-between items-center mb-4 pt-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Select
            value={filters.office}
            onValueChange={handleOfficeChange}
            disabled={isOfficeFilterDisabled} // Disable Select if the user is SUPERVISOR
          >
            <SelectTrigger className="w-[240px] bg-white flex items-center gap-2" disabled={isOfficeFilterDisabled}>
              <span className="flex-shrink-0">
                <Filter size={16} />
              </span>
              <SelectValue placeholder="Filter by office" />
            </SelectTrigger>

            <SelectContent>
              {/* Only show "All Offices" if not a supervisor */}
              {!isOfficeFilterDisabled && (
                <SelectItem value="all">All Offices</SelectItem>
              )}
              {/* If supervisor, only their department should be an option or show it as selected */}
              {isOfficeFilterDisabled && userDepartment ? (
                 <SelectItem value={userDepartment} disabled>
                    {userDepartment}
                 </SelectItem>
              ) : (
                Array.isArray(offices) &&
                offices.map((office) => (
                  <SelectItem key={office} value={office}>
                    {office}
                  </SelectItem>
                ))
              )}
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
                  ExcelExporters.toExcelFormat(
                    filters.office === "all" ? "ALL OFFICES" : filters.office,
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

        {/* Allow ADMIN and SECRETARY to add equipment. SUPERVISOR can also add to their own department. */}
        {(userRole === "ADMIN" || userRole === "SECRETARY" || userRole === "SUPERVISOR") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-700 hover:bg-indigo-900">
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                {/* Pass the userDepartment to AddEquipment if a role is SUPERVISOR */}
                <AddEquipment
                    onSuccess={handleEquipmentAdded}
                    // Optionally pass the supervisorDepartment if AddEquipment needs to pre-fill it
                    supervisorDepartment={userRole === "SUPERVISOR" ? userDepartment : undefined}
                 />
            </DialogContent>
            </Dialog>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-md border shadow-sm bg-gray-100 ">
        <div className="h-full overflow-auto">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-yellow-500">
              <TableRow className="bg-yellow-500 hover:bg-yellow-500 h-16">
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
                  Office
                </TableHead>
                {/* SUPERVISOR can also edit/delete items within their department */}
                {(userRole === "ADMIN" || userRole === "SECRETARY" || userRole === "SUPERVISOR") && (
                  <TableHead className="w-[40px]"></TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell
                     colSpan={(userRole === "ADMIN" || userRole === "SECRETARY" || userRole === "SUPERVISOR") ? 13 : 12}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {isLoading
                      ? "Loading..."
                      : filters.office !== "all"
                      ? "No equipment found for this office"
                      : "No equipment found"}
                  </TableCell>
                </TableRow>
              ) : (
                equipment.map((item) => (
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
                    <TableCell className="w-[120px]">{item.unitCost.toFixed(2)}</TableCell> {/* Added toFixed for currency */}
                    <TableCell className="w-[120px]">
                      {item.totalCost.toFixed(2)} {/* Added toFixed for currency */}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      {new Date(item.datePurchased).toLocaleDateString()} {/* More standard date format */}
                    </TableCell>
                    <TableCell className="w-[160px]">
                      {new Date(item.dateReceived).toLocaleDateString()} {/* More standard date format */}
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
                            onUpdateAction={handleEquipmentUpdated}
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

      <div className="mt-4 flex-shrink-0 ">
        <EquipmentPagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}