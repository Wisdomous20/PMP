import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "@/components/auth/Register";
import { supabase } from "@/lib/supabaseClient";

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
});


