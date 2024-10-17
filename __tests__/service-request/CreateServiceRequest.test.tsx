import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateServiceRequest from '@/components/create-service-request/CreateServiceRequest';
import { toast } from "../../src/hooks/use-toast";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("../../src/hooks/use-toast", () => ({
  toast: jest.fn(),
}));

const mockCreateServiceRequestFetch = jest.fn();
jest.mock("../../src/utils/service-request/createServiceRequestFetch", () => ({
  createServiceRequestFetch: (userId: string, title: string, details: string) => 
    mockCreateServiceRequestFetch(userId, title, details),
}));

describe("CreateServiceRequest Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input fields and submit button", () => {
    render(<CreateServiceRequest />);

    expect(screen.getByLabelText(/Title of Service Request/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Details/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("displays an error toast if required fields are empty", async () => {
    render(<CreateServiceRequest />);

    fireEvent.click(screen.getByRole("button", { name: /Send/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
    });
  });

  // Uncomment the following test cases when implementation finishes

  // it("calls createServiceRequestFetch and displays success toast on successful submission", async () => {
  //   render(<CreateServiceRequest />);
  //   const titleInput = screen.getByLabelText(/Title of Service Request/i);
  //   const detailsTextarea = screen.getByLabelText(/Details/i);

  //   fireEvent.change(titleInput, { target: { value: "Service Request Title" } });
  //   fireEvent.change(detailsTextarea, { target: { value: "Service Request Details" } });

  //   mockCreateServiceRequestFetch.mockResolvedValueOnce({ success: true });

  //   fireEvent.click(screen.getByRole("button", { name: /Send/i }));

  //   await waitFor(() => {
  //     expect(mockCreateServiceRequestFetch).toHaveBeenCalledWith(
  //       "user-123",
  //       "Service Request Title",
  //       "Service Request Details"
  //     );
  //     expect(toast).toHaveBeenCalledWith({
  //       title: "Success",
  //       description: "Your service request has been sent!",
  //     });
  //   });
  // });

  // it("displays an error toast on API failure", async () => {
  //   render(<CreateServiceRequest />);
  //   const titleInput = screen.getByLabelText(/Title of Service Request/i);
  //   const detailsTextarea = screen.getByLabelText(/Details/i);

  //   fireEvent.change(titleInput, { target: { value: "Service Request Title" } });
  //   fireEvent.change(detailsTextarea, { target: { value: "Service Request Details" } });

  //   mockCreateServiceRequestFetch.mockRejectedValueOnce(new Error("API Error"));

  //   fireEvent.click(screen.getByRole("button", { name: /Send/i }));

  //   await waitFor(() => {
  //     expect(mockCreateServiceRequestFetch).toHaveBeenCalledWith(
  //       "user-123",
  //       "Service Request Title",
  //       "Service Request Details"
  //     );
  //     expect(toast).toHaveBeenCalledWith({
  //       title: "Error",
  //       description: "Failed to create service request. Please try again.",
  //       variant: "destructive",
  //     });
  //   });
  // });
});
