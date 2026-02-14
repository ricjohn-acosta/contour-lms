import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthForm } from "../AuthForm";

let renderContainer: HTMLElement;

const mockReplace = vi.hoisted(() => vi.fn());
const mockLogin = vi.hoisted(() => vi.fn());
const mockRegister = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("next/image", () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/services/auth/auth.service", () => ({
  authService: {
    login: mockLogin,
    register: mockRegister,
  },
}));

function getForm(): HTMLFormElement {
  const root = renderContainer ?? document.body;
  const form = root.querySelector("form");
  if (!form) throw new Error("No form found");
  return form as HTMLFormElement;
}

function renderAuthForm() {
  const result = render(<AuthForm />);
  renderContainer = result.container;
  return result;
}

function getSubmitButton() {
  const form = getForm();
  const buttons = within(form).getAllByRole("button", {
    name: /^(login|register|please wait\.\.\.)$/i,
  });
  return buttons.find((b) => b.getAttribute("type") === "submit") ?? buttons[0];
}

function getSwitchToRegisterButton() {
  const form = getForm();
  const buttons = within(form).getAllByRole("button", { name: /register/i });
  return buttons.find((b) => b.getAttribute("type") === "button") ?? buttons[0];
}

function getSwitchToLoginButton() {
  const form = getForm();
  const buttons = within(form).getAllByRole("button", { name: /login/i });
  return buttons.find((b) => b.getAttribute("type") === "button") ?? buttons[0];
}

function getEmailInput(form: HTMLFormElement) {
  return within(form).getByPlaceholderText(/admin@contoureducation\.com/i);
}

function getPasswordInput(form: HTMLFormElement) {
  return within(form).getByPlaceholderText(/test@TEST1/i);
}

describe("AuthForm", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockLogin.mockClear();
    mockRegister.mockClear();
  });

  describe("form inputs", () => {
    it("shows email and password inputs", () => {
      renderAuthForm();
      const form = getForm();

      expect(within(form).getByLabelText(/email/i)).toBeInTheDocument();
      expect(within(form).getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("shows expected placeholders for email and password", () => {
      renderAuthForm();
      const form = getForm();

      expect(
        within(form).getByPlaceholderText(/admin@contoureducation\.com/i)
      ).toBeInTheDocument();
      expect(
        within(form).getByPlaceholderText(/test@TEST1/i)
      ).toBeInTheDocument();
    });
  });

  describe("validation on submit", () => {
    it("shows error messages when form inputs are empty and submit is pressed", async () => {
      renderAuthForm();
      const form = getForm();

      fireEvent.submit(form);

      await waitFor(() => {
        expect(within(form).getByText("Email is required")).toBeInTheDocument();
        expect(
          within(form).getByText("Password is required")
        ).toBeInTheDocument();
      });
    });

    it("shows email format error when email is invalid and submit is pressed", async () => {
      renderAuthForm();
      const form = getForm();

      fireEvent.change(getEmailInput(form), {
        target: { value: "not-an-email" },
      });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          within(form).getByText("Please enter a valid email")
        ).toBeInTheDocument();
      });
    });

    it("shows password min length error in register flow when password is too short", async () => {
      renderAuthForm();
      const form = getForm();

      fireEvent.click(getSwitchToRegisterButton());
      fireEvent.change(getEmailInput(form), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(getPasswordInput(form), {
        target: { value: "12345" },
      });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          within(form).getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });
    });
  });

  describe("login vs register flow", () => {
    it("shows Login when the flow is login", () => {
      renderAuthForm();

      const submitBtn = getSubmitButton();
      expect(submitBtn).toHaveAttribute("type", "submit");
      expect(submitBtn).toHaveTextContent("Login");
      expect(getSwitchToRegisterButton()).toBeInTheDocument();
    });

    it("shows Register when the flow is registration", async () => {
      renderAuthForm();

      fireEvent.click(getSwitchToRegisterButton());

      await waitFor(() => {
        expect(getSubmitButton()).toHaveTextContent("Register");
      });
      expect(getSwitchToLoginButton()).toBeInTheDocument();
    });

    it("switches back to login when clicking Login link in register flow", async () => {
      renderAuthForm();

      fireEvent.click(getSwitchToRegisterButton());
      await waitFor(() => {
        expect(getSubmitButton()).toHaveTextContent("Register");
      });

      fireEvent.click(getSwitchToLoginButton());
      await waitFor(() => {
        expect(getSubmitButton()).toHaveTextContent("Login");
      });
    });
  });

  describe("successful submit", () => {
    it("calls login and redirects when valid credentials submitted in login flow", async () => {
      mockLogin.mockResolvedValue({ data: { id: "user-1" }, error: null });
      renderAuthForm();
      const form = getForm();

      fireEvent.change(getEmailInput(form), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(getPasswordInput(form), {
        target: { value: "password123" },
      });
      fireEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "user@example.com",
          "password123"
        );
      });
      expect(mockRegister).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });

    it("calls register and redirects when valid credentials submitted in register flow", async () => {
      mockRegister.mockResolvedValue({ data: { id: "user-1" }, error: null });
      renderAuthForm();
      const form = getForm();

      fireEvent.click(getSwitchToRegisterButton());
      fireEvent.change(getEmailInput(form), {
        target: { value: "new@example.com" },
      });
      fireEvent.change(getPasswordInput(form), {
        target: { value: "password123" },
      });
      fireEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "new@example.com",
          "password123"
        );
      });
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("accessibility and layout", () => {
    it("renders the logo with correct alt text", () => {
      renderAuthForm();
      const form = getForm();

      expect(
        within(form).getByAltText("Contour Education")
      ).toBeInTheDocument();
    });

    it("submit button has type submit", () => {
      renderAuthForm();

      expect(getSubmitButton()).toHaveAttribute("type", "submit");
    });
  });
});
