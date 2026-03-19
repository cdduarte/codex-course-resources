import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthForm } from "@/src/components/auth-form";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signInEmail: vi.fn(),
  signUpEmail: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
    refresh: mocks.refresh,
  }),
}));

vi.mock("@/src/lib/auth-client", () => ({
  signIn: {
    email: mocks.signInEmail,
  },
  signUp: {
    email: mocks.signUpEmail,
  },
}));

describe("AuthForm", () => {
  beforeEach(() => {
    mocks.replace.mockReset();
    mocks.refresh.mockReset();
    mocks.signInEmail.mockReset();
    mocks.signUpEmail.mockReset();
  });

  it("submits register payload with trimmed values and redirects on success", async () => {
    mocks.signUpEmail.mockResolvedValue({ error: null });

    render(<AuthForm mode="register" />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "  Ada Lovelace  " } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "  ada@example.com  " } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(mocks.signUpEmail).toHaveBeenCalledTimes(1);
    });

    expect(mocks.signUpEmail).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });

    await waitFor(() => {
      expect(mocks.replace).toHaveBeenCalledWith("/notes");
      expect(mocks.refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("shows a generic error when login fails", async () => {
    mocks.signInEmail.mockResolvedValue({ error: { code: "INVALID_CREDENTIALS" } });

    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mocks.signInEmail).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("We couldn't complete that request. Please try again.")).toBeTruthy();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("reflects pending submit state and blocks duplicate submit calls", async () => {
    mocks.signInEmail.mockImplementation(() => new Promise<{ error: null }>(() => {}));

    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mocks.signInEmail).toHaveBeenCalledTimes(1);
      expect((submitButton as HTMLButtonElement).disabled).toBe(true);
      expect(submitButton.textContent).toBe("Please wait...");
    });

    fireEvent.click(submitButton);
    expect(mocks.signInEmail).toHaveBeenCalledTimes(1);
  });
});
