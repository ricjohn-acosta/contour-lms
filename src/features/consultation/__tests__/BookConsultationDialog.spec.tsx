import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookConsultationDialog } from "../BookConsultationDialog";
import type { User } from "@supabase/supabase-js";

const mockMutate = vi.fn();

vi.mock("@/services/consultation/consultation.mutations", () => ({
  useBookConsultation: () => ({
    mutate: mockMutate,
  }),
}));

vi.mock("@/services/tutors/tutors.queries", () => ({
  useGetTutors: () => ({
    data: [
      {
        id: "tutor-1",
        first_name: "Test",
        last_name: "Tutor",
        specialization: "Math",
        created_at: "2025-01-01T00:00:00Z",
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUser = { id: "user-123" } as User;

function getTriggerButton() {
  const buttons = screen.getAllByRole("button", {
    name: /book consultation/i,
  });
  return buttons[0];
}

function renderDialog() {
  return render(<BookConsultationDialog user={mockUser} />);
}

describe("BookConsultationDialog", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  describe("dialog open/close", () => {
    it("renders the trigger button and keeps dialog closed initially", () => {
      renderDialog();

      expect(getTriggerButton()).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens the dialog when the trigger button is clicked", () => {
      renderDialog();

      fireEvent.click(getTriggerButton());

      const dialog = screen.getByRole("dialog", {
        name: /book a consultation/i,
      });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Book a consultation")).toBeVisible();
    });

    it("closes the dialog when the close button is clicked", () => {
      renderDialog();

      fireEvent.click(getTriggerButton());
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("reopens the dialog after closing", () => {
      renderDialog();

      fireEvent.click(getTriggerButton());
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      fireEvent.click(getTriggerButton());

      expect(
        screen.getByRole("dialog", { name: /book a consultation/i })
      ).toBeInTheDocument();
    });
  });

  describe("form", () => {
    it("shows tutor, reason, and date/time when dialog is open", () => {
      renderDialog();
      fireEvent.click(getTriggerButton());

      expect(screen.getByLabelText(/choose a tutor/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/reason for consultation/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/consultation date.*time/i)
      ).toBeInTheDocument();
    });

    it("shows submit button in the dialog", () => {
      renderDialog();
      fireEvent.click(getTriggerButton());

      const dialog = screen.getByRole("dialog", { name: /book a consultation/i });
      const submitButton = within(dialog).getByRole("button", {
        name: /book consultation|booking\.\.\./i,
      });
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("shows error messages when submit is clicked with nothing selected", () => {
      renderDialog();
      fireEvent.click(getTriggerButton());

      const dialog = screen.getByRole("dialog", { name: /book a consultation/i });
      const submitButton = within(dialog).getByRole("button", {
        name: /book consultation|booking\.\.\./i,
      });
      fireEvent.click(submitButton);

      expect(screen.getByText("Please select a tutor")).toBeInTheDocument();
      expect(screen.getByText("Please select a reason")).toBeInTheDocument();
      expect(
        screen.getByText("Please pick a date and time")
      ).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
