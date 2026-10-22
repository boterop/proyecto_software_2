import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@pages/Login";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("Login Component", () => {
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
        name: "test-user-for-login",
        email: "test-user-for-login@example.com",
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

  it("renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toBeTruthy();
  });

  it("login correctly", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>,
    );

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const submitButton = document.getElementById("submit");

    await user.type(emailInput, testUser.email);
    await user.type(passwordInput, testUser.password);
    await user.click(submitButton);

    expect(await screen.findByText("Login successful.")).toBeDefined();
  });
});
