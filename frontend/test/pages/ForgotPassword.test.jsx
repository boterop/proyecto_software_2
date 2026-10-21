import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPassword from "@pages/ForgotPassword";
import userEvent from "@testing-library/user-event";

describe("ForgotPassword Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<ForgotPassword />);
    expect(container).toBeTruthy();
  });

  it("shows success message after form submission", async () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByRole("textbox", {
      name: "Email",
    });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Send reset link" }),
    );

    expect(
      await screen.findByText(
        "If an account exists with that email, you will receive a password reset link.",
      ),
    ).toBeDefined();
  });
});
