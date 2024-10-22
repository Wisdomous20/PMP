// getServiceRequestDetailsFetch.test.ts
import getServiceRequestDetailsFetch from "../../src/utils/service-request/getServiceRequestByIdFetch";

global.fetch = jest.fn();

describe("getServiceRequestDetailsFetch", () => {
  const mockServiceRequest = {
    id: "req-1",
    title: "Test Request",
    details: "Details of the request",
    status: [{ timestamp: new Date("2023-10-01") }],
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it("should fetch and return service request details when successful", async () => {
    // Mock a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockServiceRequest),
    });

    const result = await getServiceRequestDetailsFetch("req-1");

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request/req-1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(result).toEqual(mockServiceRequest);
  });

  it("should return null and log an error if the fetch request fails with a server error", async () => {
    // Mock a failed fetch response with 500 status
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValueOnce({ error: "Internal Server Error" }),
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await getServiceRequestDetailsFetch("req-2");

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request/req-2", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch service request details:",
      new Error("Error 500: Internal Server Error")
    );

    consoleSpy.mockRestore();
  });

  it("should return null and log an error if there is a network error", async () => {
    // Mock a network error (fetch throws an error)
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await getServiceRequestDetailsFetch("req-3");

    expect(global.fetch).toHaveBeenCalledWith("/api/service-request/req-3", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch service request details:",
      new Error("Network Error")
    );

    consoleSpy.mockRestore();
  });
});
