import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import getServiceRequests from '@/domains/service-request/services/getServiceRequest';
import { status as StatusEnum } from '@prisma/client';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const requests = await getServiceRequests(userId);
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch service requests', error);
    return NextResponse.json({ error: 'Failed to fetch service requests' }, { status: 500 });
  }
}
export async function PATCH(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  const serviceRequestId = params.id;
  if (!serviceRequestId) {
    return NextResponse.json({ error: 'Service Request ID is required' }, { status: 400 });
  }

  const validStatuses: StatusEnum[] = ['pending', 'in_progress', 'approved', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    const newStatus = await prisma.serviceRequestStatus.create({
      data: {
        serviceRequestId: serviceRequestId,
        status: status,
        timestamp: new Date(),
      }
    });

    const updatedServiceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: {
        status: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      }
    });

    return NextResponse.json(updatedServiceRequest, { status: 200 });
  } catch (error) {
    console.error('Failed to update service request', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to update service request', details: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}