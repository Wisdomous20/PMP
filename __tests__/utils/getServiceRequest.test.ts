// getServiceRequests.test.ts
import { prisma } from "@/lib/prisma"; // Mocked import
import getServiceRequests from "../../src/domains/service-request/services/getServiceRequest";

// Mock prisma methods
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    serviceRequest: {
      findMany: jest.fn(),
    },
  },
}));

describe("getServiceRequests", () => {
  const mockUser = {
    id: "user-1",
    user_type: "USER",
    department: "IT",
  };

  const mockServiceRequests = [
    {
      id: "req-1",
      user: { name: "John Doe" },
      title: "Test Request 1",
      details: "Details of Test Request 1",
      status: [{ timestamp: new Date("2023-10-01") }],
    },
    {
      id: "req-2",
      user: { name: "Jane Doe" },
      title: "Test Request 2",
      details: "Details of Test Request 2",
      status: [{ timestamp: new Date("2023-10-02") }],
    },
  ];

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should throw an error if user is not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null); // User not found

    await expect(getServiceRequests("user-1")).rejects.toThrow(
      "User not found"
    );
  });

  it("should return service requests for an ADMIN user", async () => {
    // Mock user as ADMIN
    prisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      user_type: "ADMIN",
    });
    // Mock service requests
    prisma.serviceRequest.findMany.mockResolvedValue(mockServiceRequests);

    const result = await getServiceRequests("admin-user");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "admin-user" },
      select: { user_type: true, department: true },
    });

    expect(prisma.serviceRequest.findMany).toHaveBeenCalledWith({
      include: {
        user: true,
        status: { orderBy: { timestamp: "asc" } },
      },
    });

    expect(result).toEqual([
      {
        id: "req-1",
        requesterName: "John Doe",
        title: "Test Request 1",
        details: "Details of Test Request 1",
        createdOn: new Date("2023-10-01"),
      },
      {
        id: "req-2",
        requesterName: "Jane Doe",
        title: "Test Request 2",
        details: "Details of Test Request 2",
        createdOn: new Date("2023-10-02"),
      },
    ]);
  });

  it("should return service requests for a SUPERVISOR user with department", async () => {
    // Mock user as SUPERVISOR with department
    prisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      user_type: "SUPERVISOR",
    });
    prisma.serviceRequest.findMany.mockResolvedValue(mockServiceRequests);

    const result = await getServiceRequests("supervisor-user");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "supervisor-user" },
      select: { user_type: true, department: true },
    });

    expect(prisma.serviceRequest.findMany).toHaveBeenCalledWith({
      where: { user: { department: "IT" } },
      include: {
        user: true,
        status: { orderBy: { timestamp: "asc" } },
      },
    });

    expect(result).toEqual([
      {
        id: "req-1",
        requesterName: "John Doe",
        title: "Test Request 1",
        details: "Details of Test Request 1",
        createdOn: new Date("2023-10-01"),
      },
      {
        id: "req-2",
        requesterName: "Jane Doe",
        title: "Test Request 2",
        details: "Details of Test Request 2",
        createdOn: new Date("2023-10-02"),
      },
    ]);
  });

  it("should return service requests for a USER", async () => {
    // Mock user as USER
    prisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      user_type: "USER",
    });
    prisma.serviceRequest.findMany.mockResolvedValue(mockServiceRequests);

    const result = await getServiceRequests("user-1");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { user_type: true, department: true },
    });

    expect(prisma.serviceRequest.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: {
        user: true,
        status: { orderBy: { timestamp: "asc" } },
      },
    });

    expect(result).toEqual([
      {
        id: "req-1",
        requesterName: "John Doe",
        title: "Test Request 1",
        details: "Details of Test Request 1",
        createdOn: new Date("2023-10-01"),
      },
      {
        id: "req-2",
        requesterName: "Jane Doe",
        title: "Test Request 2",
        details: "Details of Test Request 2",
        createdOn: new Date("2023-10-02"),
      },
    ]);
  });

  it("should throw an error for an invalid user type", async () => {
    // Mock user with invalid user_type
    prisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      user_type: "UNKNOWN",
    });

    await expect(getServiceRequests("invalid-user")).rejects.toThrow(
      "Invalid user type"
    );
  });
});
