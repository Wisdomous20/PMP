/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import createEquipment from "@/domains/inventory-management/services/createEquipment";
import getAllEquipment from "@/domains/inventory-management/services/getAllEquipment";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      description,
      brand,
      quantity,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased,
      dateReceived,
      location,
      department,
      status,
      serviceRequestId,
    } = await req.json();

    console.log("okay1")

    if (
      !description ||
      !brand ||
      !quantity ||
      !serialNumber ||
      !supplier ||
      !unitCost ||
      !totalCost ||
      !datePurchased ||
      !dateReceived ||
      !location ||
      !department ||
      !status
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEquipment = await createEquipment({
      description,
      brand,
      quantity,
      serialNumber,
      supplier,
      unitCost,
      totalCost,
      datePurchased: new Date(datePurchased),
      dateReceived: new Date(dateReceived),
      location,
      department,
      status,
      serviceRequestId: serviceRequestId || null,
    });

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to create equipment" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    if (searchParams.has('departments')) {
      const departmentsData = await prisma.equipment.findMany({
        distinct: ["department"],
        select: {
          department: true,
        },
      });
      
      const departments = departmentsData
        .map((item) => item.department)
        .filter(Boolean)
        .sort();
      
      return NextResponse.json({ departments });
    }
    
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const department = searchParams.get('department');
    
    if (!page && !pageSize) {
      const equipment = await getAllEquipment();
      return NextResponse.json(equipment, { status: 200 });
    }
    
    const currentPage = parseInt(page || '1');
    const itemsPerPage = parseInt(pageSize || '50');
    
    const whereConditions: any = {};
    if (department) {
      whereConditions.department = department;
    }
    
    const totalCount = await prisma.equipment.count({
      where: whereConditions,
    });
    
    const skip = (currentPage - 1) * itemsPerPage;
    const take = itemsPerPage;
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    
    const equipment = await prisma.equipment.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy: {
        dateReceived: 'desc',
      },
      include: {
        serviceRequest: {
          select: {
            id: true,
            details: true,
            concern: true,
          },
        },
      },
    });
    
    const mappedEquipment = equipment.map(item => ({
      id: item.id,
      quantity: item.quantity,
      description: item.description,
      brand: item.brand,
      serialNumber: item.serialNumber,
      unitCost: item.unitCost,
      totalCost: item.totalCost,
      datePurchased: item.datePurchased,
      supplier: item.supplier,
      dateReceived: item.dateReceived,
      status: item.status,
      location: item.location,
      department: item.department,
      serviceRequest: item.serviceRequest ? {
        serviceRequestId: item.serviceRequest.id,
        serviceRequestName: item.serviceRequest.concern || item.serviceRequest.id,
      } : undefined,
    }));
    
    return NextResponse.json({
      data: mappedEquipment,
      meta: {
        total: totalCount,
        page: currentPage,
        pageSize: itemsPerPage,
        pageCount,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}
