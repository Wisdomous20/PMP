import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "@/components/auth/Register";

jest.mock("../../src/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
  }));


describe.skip("Register Component - Unit Tests", () => {
    it("renders input fields and submit button", () => {
        render(<Register />);
    
        expect(screen.getByText(/Username/i)).toBeInTheDocument();
        expect(screen.getByText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Register/i })
        ).toBeInTheDocument();
      });

  it("displays error messages for invalid inputs", async () => {
    render(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Username must be at least 3 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter a valid CPU email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter a valid CPU email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character./i
        )
      ).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      Target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid CPU email address/i)
      ).toBeInTheDocument();
    });
  });

  it("displays error message when passwords do not match", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@cpu.edu.ph" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPass1@" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "DifferentPass2@" },
    });

    
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
    });
  });
});