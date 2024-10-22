import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/components/auth/Register";
import { supabase } from "@/lib/supabaseClient";
import { Target } from "lucide-react";

jest.mock('@/lib/supabaseClient', () => ({
    supabase:{
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
    }
}));

describe("Register Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    
    it("renders input fields and submit button", () => {
        render(<Register />);

        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    });

    it("displays error messages for invalid inputs", async () =>{
        render(<Register />);

        fireEvent.click(screen.getByRole("button", {name:  /Register/i}));
        await waitFor(() => {
            expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/Please enter a valid CPU email address/i)).toBeInTheDocument();
            expect(screen.getByText(/Please enter a valid CPU email address/i)).toBeInTheDocument();
            expect(screen.getByText(/Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character./i)).toBeInTheDocument();  
        })
    })

    it("validates email format", async ()=> {
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/Email/i), {Target: {value: "invalid-email"}});
        fireEvent.click(screen.getByRole("button", {name:  /Register/i}));
        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid CPU email address/i)).toBeInTheDocument();
        })
    })

});


