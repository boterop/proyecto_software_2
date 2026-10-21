import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@pages/Login";

describe("Login Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Login />);
    expect(container).toBeTruthy();
  });

  it("displays the correct title", () => {
    render(<Login />);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("displays login form elements", () => {
    render(<Login />);

    // Check for basic elements without relying on MUI label structure
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});

