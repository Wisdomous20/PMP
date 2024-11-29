// getServiceRequestFetch.test.ts
import getServiceRequestFetch from "../../src/domains/service-request/services/fetchGetServiceRequest"; // Replace with the actual path

global.fetch = jest.fn(); // Mock the fetch API

describe("getServiceRequestFetch", () => {
  const mockServiceRequests = [
    {
      id: "req-1",
      title: "Test Request 1",
      details: "Details of the request",
      status: [{ timestamp: new Date("2023-10-01") }],
    },
    {
      id: "req-2",
      title: "Test Request 2",
      details: "Details of the second request",
      status: [{ timestamp: new Date("2023-10-02") }],
    },
  ];

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should fetch and return service requests when successful", async () => {
    // Mock a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockServiceRequests),
    });

    const result = await getServiceRequestFetch("user-1");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/service-request?userId=user-1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual(mockServiceRequests);
  });

  it("should throw an error and log the error if the fetch request fails with a server error", async () => {
    // Mock a failed fetch response with 500 status
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ error: "Internal Server Error" }),
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(getServiceRequestFetch("user-2")).rejects.toThrow(
      "Error 500: Internal Server Error"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/service-request?userId=user-2",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch service requests:",
      new Error("Error 500: Internal Server Error")
    );

    consoleSpy.mockRestore();
  });

  it("should throw an error and log the error if there is a network error", async () => {
    // Mock a network error (fetch throws an error)
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(getServiceRequestFetch("user-3")).rejects.toThrow(
      "Network Error"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/service-request?userId=user-3",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch service requests:",
      new Error("Network Error")
    );

    consoleSpy.mockRestore();
  });
});
