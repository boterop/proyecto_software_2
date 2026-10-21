import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPassword from "@pages/ResetPassword";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("ResetPassword Component", () => {
  it("renders without crashing", async () => {
    const { container } = render(<ResetPassword />);
    expect(container).toBeTruthy();
  });

  it("fail to reset password with invalid token", async () => {
    const newPassword = "newPassword";
    render(
      <MemoryRouter initialEntries={["/reset-password/invalid-token"]}>
        <ResetPassword />
      </MemoryRouter>,
    );

    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const submitButton = screen.getByRole("button", {
      name: "Reset password",
    });

    await userEvent.type(newPasswordInput, newPassword);
    await userEvent.type(confirmPasswordInput, newPassword);
    await userEvent.click(submitButton);

    expect(
      await screen.findByText("The reset link is invalid or has expired."),
    ).toBeDefined();
  });

  it("show error message when passwords do not match", async () => {
    render(
      <MemoryRouter initialEntries={["/reset-password/invalid-token"]}>
        <ResetPassword />
      </MemoryRouter>,
    );

    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const submitButton = screen.getByRole("button", {
      name: "Reset password",
    });

    await userEvent.type(newPasswordInput, "newPassword");
    await userEvent.type(confirmPasswordInput, "nomatch");
    await userEvent.click(submitButton);

    expect(await screen.findByText("Passwords do not match.")).toBeDefined();
  });
});
