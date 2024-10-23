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

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe("Register Component - handleSubmit", () => {
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
});

it("handles failed registration and displays error message", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Registration failed." }),
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

      expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", expect.any(Object));
      expect(screen.getByText(/Registration failed./i)).toBeInTheDocument();
    });
  });


  it("handles network error and displays a generic error message", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error"))) as jest.Mock;
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
      expect(
        screen.getByText(/An error occurred during registration./i)
      ).toBeInTheDocument();
    });
  });

  it("displays an alert when Login Result contains an error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    jest.spyOn(window, "alert").mockImplementation(() => {});
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
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@cpu.edu.ph",
        password: "StrongPass1@",
      });
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });
})