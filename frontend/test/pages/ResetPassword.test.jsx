import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPassword from "@pages/ResetPassword";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("ResetPassword Component", () => {
  let user;
  let testUser;

  beforeAll(async () => {
    user = userEvent.setup();
    const response = await fetch(`${API_URL}/test/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test-user",
        email: "test@example.com",
        password: "Password123!",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create test user: ${response.status}`);
    }

    testUser = await response.json();
  });

  afterAll(async () => {
    if (!testUser?.id) {
      return;
    }

    const response = await fetch(`${API_URL}/test/users/${testUser.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete test user: ${response.status}`);
    }
  });

  it("renders without crashing", async () => {
    const { container } = render(<ResetPassword />);
    expect(container).toBeTruthy();
  });

  it("success to reset password", async () => {
    const response = await fetch(`${API_URL}/test/password-recovery/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
      }),
    });

    const result = await response.json();
    const token = result.token;

    const newPassword = "newPassword";
    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>,
    );

    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const submitButton = screen.getByRole("button", {
      name: "Restablecer contraseña",
    });

    await user.type(newPasswordInput, newPassword);
    await user.type(confirmPasswordInput, newPassword);
    await user.click(submitButton);

    expect(
      await screen.findByText(
        "Tu contraseña ha sido restablecida exitosamente.",
      ),
    ).toBeDefined();

    const userResponse = await fetch(`${API_URL}/test/users/${testUser.id}`, {
      method: "GET",
    });

    const updatedUser = await userResponse.json();

    expect(updatedUser.password).not.toBe(newPassword);
    expect(updatedUser.password).not.toBe(testUser.password);
    expect(updatedUser.password).toMatch(/^\$2[aby]\$\d{2}\$/);
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
      name: "Restablecer contraseña",
    });

    await user.type(newPasswordInput, newPassword);
    await user.type(confirmPasswordInput, newPassword);
    await user.click(submitButton);

    expect(
      await screen.findByText(
        "El enlace de restablecimiento no es válido o ha expirado.",
      ),
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
      name: "Restablecer contraseña",
    });

    await user.type(newPasswordInput, "newPassword");
    await user.type(confirmPasswordInput, "nomatch");
    await user.click(submitButton);

    expect(
      await screen.findByText("Las contraseñas no coinciden."),
    ).toBeDefined();
  });
});
