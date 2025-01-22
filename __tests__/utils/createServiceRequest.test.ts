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

describe("createServiceRequest", () => {
  const mockServiceRequest = {
    id: "123",
    userId: "user-1",
    concern: "Test Service Request",
    details: "Details about the service request",
    status: [{ status: "pending", timestamp: new Date() }],
  };

  it("should create a service request successfully", async () => {
    (prisma.serviceRequest.create as jest.Mock).mockResolvedValue(mockServiceRequest);

    const userId = "user-1";
    const concern = "Test Service Request";
    const details = "Details about the service request";

    const result = await createServiceRequest(userId, concern, details);

    expect(prisma.serviceRequest.create).toHaveBeenCalledWith({
      data: {
        userId,
        concern,
        details,
        status: {
          create: {
            status: "pending",
            timestamp: expect.any(Date),
          },
        },
      },
    });

    expect(result).toEqual(mockServiceRequest);
  });

  it("should throw an error if prisma.create fails", async () => {
    (prisma.serviceRequest.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    const userId = "user-1";
    const title = "Test Service Request";
    const details = "Details about the service request";

    await expect(createServiceRequest(userId, title, details)).rejects.toThrow(
      "Failed to create service request"
    );
  });
});
