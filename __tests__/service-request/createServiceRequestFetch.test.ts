import createServiceRequestFetch from "../../src/utils/service-request/createServiceRequestFetch"; // Adjust this path

describe("createServiceRequestFetch", () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with correct parameters and return response data", async () => {
    const userId = "user-123";
    const title = "Test Title";
    const details = "Test Details";
    const mockResponse = { success: true };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const response = await createServiceRequestFetch(userId, title, details);

    expect(mockFetch).toHaveBeenCalledWith("/api/service-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, title, details }),
    });

    expect(response).toEqual(mockResponse);
  });

  it("should throw an error if fetch fails", async () => {
    const userId = "user-123";
    const title = "Test Title";
    const details = "Test Details";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error 500: Error occurred" }),
    } as Response);

    await expect(createServiceRequestFetch(userId, title, details)).rejects.toThrow(
      "Error 500: Error occurred"
    );
  });
});
