import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@/components/auth/Login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login Component", () => {
  let mockRouter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders login form correctly", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@cpu.edu.ph" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@cpu.edu.ph");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits the form successfully", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "test@cpu.edu.ph" } });
    fireEvent.change(passwordInput, { target: { value: "P@ssw0rd1234" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@cpu.edu.ph",
        password: "P@ssw0rd1234",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message on login failure", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: "Invalid email or password" });

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "test@cpu.edu.ph" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@cpu.edu.ph",
        password: "wrongpassword",
      });
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("displays error message when email is not found", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: "Email not found. Please register first" });

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "nonexistent@cpu.edu.ph" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "nonexistent@cpu.edu.ph",
        password: "password123",
      });
      expect(screen.getByText("Email not found. Please register first")).toBeInTheDocument();
    });
  });

  it("displays error message on server error", async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error("Server error"));

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    fireEvent.change(emailInput, { target: { value: "test@cpu.edu.ph" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@cpu.edu.ph",
        password: "password123",
      });
      expect(screen.getByText("An error occurred during login")).toBeInTheDocument();
    });
  });
});