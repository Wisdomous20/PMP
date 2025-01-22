// createServiceRequest.test.ts
import { prisma } from "../../src/lib/prisma"; // Mocked import
import createServiceRequest from "../../src/domains/service-request/services/createServiceRequest";

// Mock prisma serviceRequest.create
jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    serviceRequest: {
      create: jest.fn(),
    },
  },
}));

describe.skip("createServiceRequest", () => {
  const mockServiceRequest = {
    id: "123",
    userId: "user-1",
    title: "Test Service Request",
    details: "Details about the service request",
    status: [{ status: "Pending", timestamp: new Date() }],
  };

  it("should create a service request successfully", async () => {
    // Mock prisma response
    prisma.serviceRequest.create.mockResolvedValue(mockServiceRequest);

    const userId = "user-1";
    const title = "Test Service Request";
    const details = "Details about the service request";

    const result = await createServiceRequest(userId, title, details);

    expect(prisma.serviceRequest.create).toHaveBeenCalledWith({
      data: {
        userId,
        title,
        details,
        status: {
          create: {
            status: "Pending",
            timestamp: expect.any(Date), // Validate timestamp is a Date
          },
        },
      },
    });

    expect(result).toEqual(mockServiceRequest);
  });

  it("should throw an error if prisma.create fails", async () => {
    prisma.serviceRequest.create.mockRejectedValue(new Error("Database error"));

    const userId = "user-1";
    const title = "Test Service Request";
    const details = "Details about the service request";

    await expect(createServiceRequest(userId, title, details)).rejects.toThrow(
      "Failed to create service request"
    );
  });
});
