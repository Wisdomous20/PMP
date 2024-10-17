
import getServiceRequestFetch from "../../src/utils/service-request/getServiceRequestFetch";

describe("getServiceRequestFetch", () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks()
  });

  it("should construct the correct endpoint and return response data", async () => {
    const inputs : GetServiceRequestInputs = {
      userType: "USER",
      userId: "user-123",
      department: "IT",
    };
    const mockResponse = { serviceRequests: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const response = await getServiceRequestFetch(inputs);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/service-requests?userType=USER&userId=user-123&department=IT",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    expect(response).toEqual(mockResponse);
  });

  it("should construct the correct endpoint without userId and department", async () => {
    const inputs : GetServiceRequestInputs = {
      userType: "ADMIN",
      userId: undefined,
      department: undefined,
    };
    const mockResponse = { serviceRequests: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const response = await getServiceRequestFetch(inputs);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/service-requests?userType=ADMIN",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    expect(response).toEqual(mockResponse);
  });

  it("should throw an error if fetch fails", async () => {
    const inputs : GetServiceRequestInputs = {
      userType: "USER",
      userId: "user-123",
      department: "IT",
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error 500: Error occurred" }),
    } as Response);

    await expect(getServiceRequestFetch(inputs)).rejects.toThrow(
      "Error 500: Error occurred"
    );
  })
});
