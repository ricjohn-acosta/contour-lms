import React from "react";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConsultationTableTabs } from "../ConsultationTableTabs";
import type { ConsultationStatusFilter } from "../ConsultationTableTabs";

function renderTabs(value: ConsultationStatusFilter = "all") {
  const onValueChange = vi.fn();
  const result = render(
    <ConsultationTableTabs value={value} onValueChange={onValueChange} />
  );
  const scope = within(result.container);
  return { onValueChange, scope, ...result };
}

describe("ConsultationTableTabs", () => {
  describe("rendering", () => {
    it("renders the tabs list with All, Completed, and Incomplete triggers", () => {
      const { scope } = renderTabs();

      expect(scope.getByRole("tablist")).toBeInTheDocument();
      expect(scope.getByRole("tab", { name: /^all$/i })).toBeInTheDocument();
      expect(
        scope.getByRole("tab", { name: /^completed$/i })
      ).toBeInTheDocument();
      expect(
        scope.getByRole("tab", { name: /^incomplete$/i })
      ).toBeInTheDocument();
    });

    it("renders with value 'all' and marks All as selected", () => {
      const { scope } = renderTabs("all");

      const allTab = scope.getByRole("tab", { name: /^all$/i });
      expect(allTab).toHaveAttribute("data-state", "active");
    });

    it("renders with value 'complete' and marks Completed as selected", () => {
      const { scope } = renderTabs("complete");

      const completedTab = scope.getByRole("tab", { name: /^completed$/i });
      expect(completedTab).toHaveAttribute("data-state", "active");
    });

    it("renders with value 'incomplete' and marks Incomplete as selected", () => {
      const { scope } = renderTabs("incomplete");

      const incompleteTab = scope.getByRole("tab", { name: /^incomplete$/i });
      expect(incompleteTab).toHaveAttribute("data-state", "active");
    });
  });

  describe("interaction", () => {
    it("calls onValueChange with 'complete' when Completed tab is clicked", async () => {
      const user = userEvent.setup();
      const { onValueChange, scope } = renderTabs("all");

      await user.click(scope.getByRole("tab", { name: /^completed$/i }));

      expect(onValueChange).toHaveBeenCalledWith("complete");
    });

    it("calls onValueChange with 'incomplete' when Incomplete tab is clicked", async () => {
      const user = userEvent.setup();
      const { onValueChange, scope } = renderTabs("all");

      await user.click(scope.getByRole("tab", { name: /^incomplete$/i }));

      expect(onValueChange).toHaveBeenCalledWith("incomplete");
    });

    it("calls onValueChange with 'all' when All tab is clicked", async () => {
      const user = userEvent.setup();
      const { onValueChange, scope } = renderTabs("complete");

      await user.click(scope.getByRole("tab", { name: /^all$/i }));

      expect(onValueChange).toHaveBeenCalledWith("all");
    });
  });
});
