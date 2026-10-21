import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@pages/Home";

describe("Home Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Home />);
    expect(container).toBeTruthy();
  });
});

