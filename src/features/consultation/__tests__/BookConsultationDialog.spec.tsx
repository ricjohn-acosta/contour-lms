import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BookConsultationDialog } from "../BookConsultationDialog";

function getTriggerButton() {
  const buttons = screen.getAllByRole("button", {
    name: /book consultation/i,
  });
  return buttons[0];
}

describe("BookConsultationDialog", () => {
  describe("dialog open/close", () => {
    it("renders the trigger button and keeps dialog closed initially", () => {
      render(<BookConsultationDialog />);

      expect(getTriggerButton()).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens the dialog when the trigger button is clicked", () => {
      render(<BookConsultationDialog />);

      fireEvent.click(getTriggerButton());

      const dialog = screen.getByRole("dialog", {
        name: /book a consultation/i,
      });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Book a consultation")).toBeVisible();
    });

    it("closes the dialog when the close button is clicked", () => {
      render(<BookConsultationDialog />);

      fireEvent.click(getTriggerButton());
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("reopens the dialog after closing", () => {
      render(<BookConsultationDialog />);

      fireEvent.click(getTriggerButton());
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      fireEvent.click(getTriggerButton());

      expect(
        screen.getByRole("dialog", { name: /book a consultation/i })
      ).toBeInTheDocument();
    });
  });
});
