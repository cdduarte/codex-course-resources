import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageShell } from "@/src/components/page-shell";

describe("PageShell", () => {
  it("renders title, description, and eyebrow content", () => {
    render(
      <PageShell eyebrow="Notes" title="Create Note" description="Draft your note.">
        <p>Editor content</p>
      </PageShell>,
    );

    expect(screen.getByText("Notes")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Create Note" })).toBeTruthy();
    expect(screen.getByText("Draft your note.")).toBeTruthy();
    expect(screen.getByText("Editor content")).toBeTruthy();
  });

  it("renders the optional header action when provided", () => {
    render(
      <PageShell
        title="Create Note"
        description="Draft your note."
        headerAction={<button type="button">Back to notes</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Back to notes" })).toBeTruthy();
  });

  it("does not render a header action container when omitted", () => {
    render(<PageShell title="Create Note" description="Draft your note." />);

    expect(screen.queryByRole("button", { name: "Back to notes" })).toBeNull();
  });
});
