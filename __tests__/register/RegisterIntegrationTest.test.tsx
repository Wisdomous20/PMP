import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "@/components/auth/Register";
import { signIn } from "next-auth/react";

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

describe.skip("Register Component - Integration Tests", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
    
      it("submits the form successfully and signs in the user", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        ) as jest.Mock;
    
        (signIn as jest.Mock).mockResolvedValueOnce({ error: null });
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
          target: { value: "StrongPass1@" },
        });
    
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", expect.any(Object));
          expect(signIn).toHaveBeenCalledWith("credentials", {
            redirect: false,
            email: "test@cpu.edu.ph",
            password: "StrongPass1@",
          });
        });
      });
    
      it("displays error message on registration failure", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Registration failed" }),
          })
        ) as jest.Mock;
    
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
          target: { value: "StrongPass1@" },
        });
    
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    
        await waitFor(() => {
          expect(screen.getByText("Registration failed")).toBeInTheDocument();
        });
      });
    });