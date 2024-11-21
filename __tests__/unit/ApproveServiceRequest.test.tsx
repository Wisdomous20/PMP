import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ApproveServiceRequest from "@/components/view-service-request/ApproveServiceRequest";
import fetchGetSupervisors from "@/utils/supervisor/fetchGetSupervisors";

jest.mock("../../src/utils/supervisor/fetchGetSupervisors");

describe("ApproveServiceRequest Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the approve button", () => {
    render(<ApproveServiceRequest />);
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
  });

  it("opens the approval dialog when the approve button is clicked", () => {
    render(<ApproveServiceRequest />);
    fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    expect(screen.getByText(/approve service request/i)).toBeInTheDocument();
  });

  it("opens the approval dialog when the approve button is clicked", () => {
    render(<ApproveServiceRequest />);
    fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    expect(screen.getByText(/approve service request/i)).toBeInTheDocument();
  });


  it("fetches and displays supervisors in the dropdown", async () => {
    const mockSupervisors = [
      { id: "1", name: "Supervisor 1", department: "IT" },
      { id: "2", name: "Supervisor 2", department: "HR" },
    ];
    (fetchGetSupervisors as jest.Mock).mockResolvedValue(mockSupervisors);

    render(<ApproveServiceRequest />);
    fireEvent.click(screen.getByRole("button", { name: /Approve/i }));
    fireEvent.mouseDown(screen.getByText("Select a Supervisor"));
    expect(screen.getByText("Supervisor 1")).toBeInTheDocument();
    expect(screen.getByText("Supervisor 2")).toBeInTheDocument();

  });
});