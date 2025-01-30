// getServiceRequestById.test.ts
import { prisma } from "../../src/lib/prisma"; // Mocked import
import getServiceRequestById from "../../src/domains/service-request/services/getServiceRequestById";

// Mock prisma methods
jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    serviceRequest: {
      findUnique: jest.fn(),
    },
  },
}));

describe.skip("getServiceRequestById", () => {
  const mockServiceRequest = {
    id: "req-1",
    user: { name: "John Doe" },
    title: "Test Request",
    details: "Details of the request",
    status: [
      { timestamp: new Date("2023-10-01") },
      { timestamp: new Date("2023-10-02") },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should throw an error if the service request is not found", async () => {
    prisma.serviceRequest.findUnique.mockResolvedValue(null); // No service request found

    await expect(getServiceRequestById("req-999")).rejects.toThrow(
      "Service request not found"
    );
  });

  it("should return the service request details when found", async () => {
    // Mock the service request
    prisma.serviceRequest.findUnique.mockResolvedValue(mockServiceRequest);

    const result = await getServiceRequestById("req-1");

    expect(prisma.serviceRequest.findUnique).toHaveBeenCalledWith({
      where: { id: "req-1" },
      include: {
        user: true,
        status: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    expect(result).toEqual({
      requesterName: "John Doe",
      title: "Test Request",
      details: "Details of the request",
      createdOn: new Date("2023-10-01"),
    });
  });

  it("should handle the case when the service request has no status", async () => {
    // Mock the service request without status
    const serviceRequestWithoutStatus = {
      ...mockServiceRequest,
      status: [],
    };

    prisma.serviceRequest.findUnique.mockResolvedValue(
      serviceRequestWithoutStatus
    );

    const result = await getServiceRequestById("req-2");

    expect(result).toEqual({
      requesterName: "John Doe",
      title: "Test Request",
      details: "Details of the request",
      createdOn: null, // No status, so createdOn is null
    });
  });
});
