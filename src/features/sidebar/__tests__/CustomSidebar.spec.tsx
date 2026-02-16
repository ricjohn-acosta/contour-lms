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

// Mock next/navigation for useRouter (used in logout)
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// Mock useIsMobile so we get desktop sidebar (collapsible div, not Sheet)
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const mockUser = { email: "test@example.com" } as Parameters<
  typeof CustomSidebar
>[0]["user"];

function renderCustomSidebar() {
  return render(
    <SidebarProvider>
      <CustomSidebar user={mockUser} />
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
      expect(consultationsLinks[0]).toHaveAttribute("href", "/dashboard");
    });

    it("renders the header with dashboard link and Home group label", () => {
      renderCustomSidebar();

      const logoLinks = screen.getAllByRole("link", {
        name: /contour education/i,
      });
      expect(logoLinks.length).toBeGreaterThan(0);
      expect(logoLinks[0]).toHaveAttribute("href", "/dashboard");
      const homeLabels = screen.getAllByText("Home");
      expect(homeLabels.length).toBeGreaterThan(0);
      expect(homeLabels[0]).toBeInTheDocument();
    });

    it("renders the logo image in the header", () => {
      renderCustomSidebar();

      const logos = screen.getAllByAltText("Contour Education");
      expect(logos[0]).toBeInTheDocument();
      expect(logos[0]).toHaveAttribute(
        "src",
        "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png"
      );
    });

    it("renders the Logout button in the footer", () => {
      renderCustomSidebar();

      const logoutButtons = screen.getAllByRole("button", { name: /logout/i });
      expect(logoutButtons.length).toBeGreaterThan(0);
      expect(logoutButtons[0]).toBeInTheDocument();
    });

    it("renders the user email in the footer", () => {
      renderCustomSidebar();

      const emailElements = screen.getAllByText("test@example.com");
      expect(emailElements.length).toBeGreaterThan(0);
      expect(emailElements[0]).toBeInTheDocument();
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
