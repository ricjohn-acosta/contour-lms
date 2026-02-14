import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CustomSidebar } from "../CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Mock next/image to render a plain img
vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

// Mock useIsMobile so we get desktop sidebar (collapsible div, not Sheet)
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

function renderCustomSidebar() {
  return render(
    <SidebarProvider>
      <CustomSidebar />
    </SidebarProvider>
  );
}

describe("CustomSidebar", () => {
  describe("sidebar items", () => {
    it("always renders sidebar items", () => {
      renderCustomSidebar();

      expect(screen.getByText("Consultations")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      const consultationsLinks = screen.getAllByRole("link", {
        name: /consultations/i,
      });
      expect(consultationsLinks.length).toBeGreaterThan(0);
      expect(consultationsLinks[0]).toBeInTheDocument();
    });

    it("renders the Consultations menu item with correct href", () => {
      renderCustomSidebar();

      const consultationsLinks = screen.getAllByRole("link", {
        name: /consultations/i,
      });
      expect(consultationsLinks[0]).toHaveAttribute(
        "href",
        "/dashboard/consultations"
      );
    });

    it("renders the header with Dashboard link and label", () => {
      renderCustomSidebar();

      const dashboardLinks = screen.getAllByRole("link", {
        name: /dashboard/i,
      });
      expect(dashboardLinks[0]).toHaveAttribute("href", "/dashboard");
      const dashboardLabels = screen.getAllByText("Dashboard");
      expect(dashboardLabels[0]).toBeInTheDocument();
    });

    it("renders the logo image in the header", () => {
      renderCustomSidebar();

      const logos = screen.getAllByAltText("Contour Education");
      expect(logos[0]).toBeInTheDocument();
      expect(logos[0]).toHaveAttribute(
        "src",
        "https://www.contoureducation.com.au/wp-content/uploads/2025/11/Contour-Education-Mob-Logo.png"
      );
    });
  });

  describe("visibility", () => {
    it("is always visible in the document", () => {
      const { container } = renderCustomSidebar();

      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toBeInTheDocument();
    });

    it("renders sidebar content container", () => {
      const { container } = renderCustomSidebar();

      const content = container.querySelector('[data-sidebar="content"]');
      expect(content).toBeInTheDocument();
    });

    it("renders sidebar header and content sections", () => {
      const { container } = renderCustomSidebar();

      const header = container.querySelector('[data-sidebar="header"]');
      const group = container.querySelector('[data-sidebar="group"]');
      expect(header).toBeInTheDocument();
      expect(group).toBeInTheDocument();
    });
  });

  describe("collapsible", () => {
    it("is collapsible (sidebar has data-state for expanded/collapsed)", () => {
      const { container } = renderCustomSidebar();

      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-state");
      expect(["expanded", "collapsed"]).toContain(
        sidebar?.getAttribute("data-state")
      );
    });

    it("defaults to expanded state", () => {
      const { container } = renderCustomSidebar();

      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-state", "expanded");
    });

    it("has data-side and data-variant for styling/collapse behavior", () => {
      const { container } = renderCustomSidebar();

      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-side", "left");
      expect(sidebar).toHaveAttribute("data-variant", "sidebar");
    });
  });
});
