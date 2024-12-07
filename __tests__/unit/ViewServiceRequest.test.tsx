import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServiceRequestDetails from "@/components/service-request/ServiceRequestDetails";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Service Request Details", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProps = {
    requestorName: "Aljason",
    title: "Maguillano Laluma",
    details: "No im mykiel",
    createdOn: "2024-03-20T10:30:00Z",
  };

  it("renders all the component elements correctly", async () => {
    render(<ServiceRequestDetails {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.details)).toBeInTheDocument();
    expect(screen.getByText(mockProps.requestorName)).toBeInTheDocument();

    expect(screen.getByText("Reject")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();

    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
  });

  it("formats the date correctly", async () => {
    render(<ServiceRequestDetails {...mockProps} />);

    const dateElement = screen.getByText(/2024/);
    expect(dateElement).toBeInTheDocument();
  });

  it("generates correct avatar fallback from requestor name", async () => {
    render(<ServiceRequestDetails {...mockProps} />);

    const avatarFallback = screen.getByText("A");
    expect(avatarFallback).toBeInTheDocument();
  });

  it("has buttons with accessible names", async () => {
    render(<ServiceRequestDetails {...mockProps} />);

    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /approve/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("handles empty requestor name", async () => {
    const propsWithEmptyName = {
      ...mockProps,
      requestorName: " ",
    };
    render(<ServiceRequestDetails {...propsWithEmptyName} />);

    const avatarFallback = screen.getByTestId("requestor-name");
    expect(avatarFallback).toBeInTheDocument();
  });

  it("handles malformed date", async () => {
    const propsWithBadDate = {
      ...mockProps,
      createdOn: "invalid-date",
    };

    expect(() => {
      render(<ServiceRequestDetails {...propsWithBadDate} />);
    }).not.toThrow();
  });
});
