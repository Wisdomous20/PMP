// createServiceRequestFetch.test.ts
import createServiceRequestFetch from "../../src/domains/service-request/services/fetchCreateServiceRequest"; // Replace with the actual path

global.fetch = jest.fn(); // Mock the fetch API

describe.skip("createServiceRequestFetch", () => {
  const mockRequestData = {
    userId: "user-1",
    title: "New Request",
    details: "Details of the new service request",
  };

  const mockResponseData = {
    id: "req-1",
    userId: "user-1",
    title: "New Request",
    details: "Details of the new service request",
    status: "Pending",
    createdAt: new Date("2023-10-01"),
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should create a new service request when the response is successful", async () => {
    // Mock a successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData),
    });

    const result = await createServiceRequestFetch(
      mockRequestData.userId,
      mockRequestData.title,
      mockRequestData.details
    );

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockRequestData),
    });

    expect(result).toEqual(mockResponseData);
  });

  it("should throw an error and log the error if the request fails with a server error", async () => {
    // Mock a failed fetch response with a 500 status
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ error: "Internal Server Error" }),
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      createServiceRequestFetch(
        mockRequestData.userId,
        mockRequestData.title,
        mockRequestData.details
      )
    ).rejects.toThrow("Error 500: Internal Server Error");

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockRequestData),
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create service request:",
      new Error("Error 500: Internal Server Error")
    );

    consoleSpy.mockRestore();
  });

  it("should throw an error and log the error if there is a network error", async () => {
    // Mock a network error (fetch throws an error)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      createServiceRequestFetch(
        mockRequestData.userId,
        mockRequestData.title,
        mockRequestData.details
      )
    ).rejects.toThrow("Network Error");

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockRequestData),
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create service request:",
      new Error("Network Error")
    );

    consoleSpy.mockRestore();
  });
});
