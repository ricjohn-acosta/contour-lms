import React from "react";
import { render, within, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConsultationTable } from "../ConsultationTable";
import type { ConsultationWithTutor } from "@/services/consultation/consultation.service";

const mockMarkComplete = vi.fn();
const mockMarkIncomplete = vi.fn();

vi.mock("@/services/consultation/consultation.mutations", () => ({
  useMarkConsultationComplete: () => ({ mutate: mockMarkComplete }),
  useMarkConsultationIncomplete: () => ({ mutate: mockMarkIncomplete }),
}));

function makeConsultation(
  overrides: Partial<ConsultationWithTutor> = {}
): ConsultationWithTutor {
  return {
    id: "consult-1",
    scheduled_at: "2025-02-10T14:30:00Z",
    created_at: "2025-02-10T14:30:00Z",
    reason: "Homework help",
    status: "incomplete",
    tutor_id: "tutor-1",
    user_id: "user-1",
    tutors: {
      id: "tutor-1",
      first_name: "Jane",
      last_name: "Doe",
      specialization: "Math",
      created_at: "2025-01-01T00:00:00Z",
    },
    ...overrides,
  };
}

function renderTable(data: ConsultationWithTutor[] = []) {
  const result = render(<ConsultationTable data={data} />);
  const scope = within(result.container);
  return { ...result, scope };
}

describe("ConsultationTable", () => {
  beforeEach(() => {
    mockMarkComplete.mockClear();
    mockMarkIncomplete.mockClear();
  });

  describe("rendering", () => {
    it("renders the table container with border and rounded corners", () => {
      const { container } = renderTable();
      const wrapper = container.querySelector(
        ".overflow-hidden.rounded-lg.border"
      );
      expect(wrapper).toBeInTheDocument();
    });

    it("renders column headers", () => {
      const { scope } = renderTable([makeConsultation()]);

      expect(
        scope.getByRole("columnheader", { name: /first name/i })
      ).toBeInTheDocument();
      expect(
        scope.getByRole("columnheader", { name: /last name/i })
      ).toBeInTheDocument();
      expect(
        scope.getByRole("columnheader", { name: /reason for consultation/i })
      ).toBeInTheDocument();
      expect(
        scope.getByRole("columnheader", { name: /status/i })
      ).toBeInTheDocument();
      expect(
        scope.getByRole("columnheader", { name: /consultation date/i })
      ).toBeInTheDocument();
    });

    it("renders empty state when data is empty", () => {
      const { scope } = renderTable();

      expect(scope.getByText("No consultations found.")).toBeInTheDocument();
    });

    it("renders one row with tutor name, reason, status, and date", () => {
      const consultation = makeConsultation();
      const { scope } = renderTable([consultation]);

      expect(scope.getByText("Jane")).toBeInTheDocument();
      expect(scope.getByText("Doe")).toBeInTheDocument();
      expect(scope.getByText("Homework help")).toBeInTheDocument();
      expect(scope.getByText("Incomplete")).toBeInTheDocument();
      // Date is formatted with toLocaleString; exact string depends on timezone
      expect(scope.getByText(/Feb \d+, 2025/)).toBeInTheDocument();
    });

    it("renders Complete status badge when status is complete", () => {
      const { scope } = renderTable([makeConsultation({ status: "complete" })]);

      expect(scope.getByText("Complete")).toBeInTheDocument();
    });

    it("renders em dash for missing tutor first name", () => {
      const { scope } = renderTable([
        makeConsultation({
          tutors: {
            id: "tutor-1",
            first_name: null,
            last_name: "Doe",
            specialization: null,
            created_at: "2025-01-01T00:00:00Z",
          },
        }),
      ]);

      expect(scope.getByText("—")).toBeInTheDocument();
      expect(scope.getByText("Doe")).toBeInTheDocument();
    });

    it("renders em dash for missing reason", () => {
      const { scope } = renderTable([makeConsultation({ reason: null })]);

      const cells = scope.getAllByText("—");
      expect(cells.length).toBeGreaterThanOrEqual(1);
    });

    it("renders em dash for missing consultation date (scheduled_at)", () => {
      const { scope } = renderTable([makeConsultation({ scheduled_at: "" })]);

      expect(scope.getByText("—")).toBeInTheDocument();
    });

    it("renders actions button with accessible label", () => {
      const { scope } = renderTable([makeConsultation()]);

      const actionsButton = scope.getByRole("button", {
        name: /open actions menu/i,
      });
      expect(actionsButton).toBeInTheDocument();
    });

    it("renders multiple rows when given multiple consultations", () => {
      const data = [
        makeConsultation({
          id: "1",
          tutors: {
            ...makeConsultation().tutors,
            first_name: "Alice",
            last_name: "A",
          },
        }),
        makeConsultation({
          id: "2",
          tutors: {
            ...makeConsultation().tutors,
            first_name: "Bob",
            last_name: "B",
          },
        }),
      ];
      const { scope } = renderTable(data);

      expect(scope.getByText("Alice")).toBeInTheDocument();
      expect(scope.getByText("Bob")).toBeInTheDocument();
    });
  });

  describe("actions menu", () => {
    function openActionsMenu(scope: ReturnType<typeof renderTable>["scope"]) {
      const button = scope.getByRole("button", { name: /open actions menu/i });
      // Radix DropdownMenu opens on pointerdown, not click
      fireEvent.pointerDown(button);
    }

    it("opens menu and shows Mark as complete for incomplete consultation", () => {
      const { scope } = renderTable([
        makeConsultation({ status: "incomplete" }),
      ]);

      openActionsMenu(scope);

      // Dropdown content is portaled to document.body
      const markComplete = screen.getByRole("menuitem", {
        name: /mark as complete/i,
      });
      expect(markComplete).toBeInTheDocument();
    });

    it("opens menu and shows Mark as incomplete for complete consultation", () => {
      const { scope } = renderTable([makeConsultation({ status: "complete" })]);

      openActionsMenu(scope);

      const markIncomplete = screen.getByRole("menuitem", {
        name: /mark as incomplete/i,
      });
      expect(markIncomplete).toBeInTheDocument();
    });

    it("calls mark complete mutation when Mark as complete is selected", async () => {
      const user = userEvent.setup();
      const consultation = makeConsultation({
        id: "consult-99",
        status: "incomplete",
      });
      const { scope } = renderTable([consultation]);

      openActionsMenu(scope);
      await user.click(
        screen.getByRole("menuitem", { name: /mark as complete/i })
      );

      expect(mockMarkComplete).toHaveBeenCalledWith("consult-99");
      expect(mockMarkIncomplete).not.toHaveBeenCalled();
    });

    it("calls mark incomplete mutation when Mark as incomplete is selected", async () => {
      const user = userEvent.setup();
      const consultation = makeConsultation({
        id: "consult-88",
        status: "complete",
      });
      const { scope } = renderTable([consultation]);

      openActionsMenu(scope);
      await user.click(
        screen.getByRole("menuitem", { name: /mark as incomplete/i })
      );

      expect(mockMarkIncomplete).toHaveBeenCalledWith("consult-88");
      expect(mockMarkComplete).not.toHaveBeenCalled();
    });
  });
});
