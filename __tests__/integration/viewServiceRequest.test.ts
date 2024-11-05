import { NextRequest } from 'next/server';
import { GET } from "../../src/app/api/service-request/[id]/route";
import getServiceRequests from "@/utils/service-request/getServiceRequest";
import { prisma } from "@/lib/prisma";

jest.mock("../../src/utils/service-request/getServiceRequest", () => {
  return jest.fn();
});

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    $disconnect: jest.fn(),
  }
}));

jest.mock('next/server', () => ({
  NextRequest: class {
    constructor(url: string) {
      this.url = url;
    }
    url: string;
  },
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      status: options?.status || 200,
      json: async () => data,
    })),
  },
}));

beforeAll(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("View Service Request", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles 400 error when userId is missing", async () => {
   
    const mockRequest = new NextRequest('http://localhost:3000/api/service-request');

    const response = await GET(mockRequest);
    const error = await response.json();

    expect(response.status).toBe(400);
    expect(error).toEqual({ error: "Missing required fields" });
  });

  it("successfully retrieves service requests", async () => {
    const mockServiceRequests = [
      {
        id: "1",
        title: "This is title",
        details: "this is detail",
        userId: "user-id"
      }
    ];

    (getServiceRequests as jest.Mock).mockResolvedValue(mockServiceRequests);

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/service-request?userId=user-id'
    );

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockServiceRequests);
    expect(getServiceRequests).toHaveBeenCalledWith("user-id");
  });

  it("handles errors when fetching service requests fails", async () => {

    (getServiceRequests as jest.Mock).mockRejectedValue(new Error("Database error"));

    const mockRequest = new NextRequest(
      'http://localhost:3000/api/service-request?userId=user-id'
    );

    const response = await GET(mockRequest);
    const error = await response.json();

    expect(response.status).toBe(500);
    expect(error).toEqual({ error: "Failed to retrieve service requests" });
  });
});


