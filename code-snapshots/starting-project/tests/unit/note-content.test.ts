import { describe, expect, it } from "vitest";
import { getDefaultNoteContent, parseNoteContentJson } from "@/src/lib/note-content";

describe("note-content utilities", () => {
  it("returns the default note content shape", () => {
    expect(getDefaultNoteContent()).toEqual({
      type: "doc",
      content: [{ type: "paragraph" }],
    });
  });

  it("parses valid note content JSON", () => {
    const content = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
    };

    expect(parseNoteContentJson(JSON.stringify(content))).toEqual(content);
  });

  it("falls back to default content for malformed JSON", () => {
    expect(parseNoteContentJson("{invalid")).toEqual(getDefaultNoteContent());
  });

  it("falls back to default content for non-object JSON values", () => {
    expect(parseNoteContentJson(JSON.stringify("text"))).toEqual(getDefaultNoteContent());
    expect(parseNoteContentJson(JSON.stringify([1, 2, 3]))).toEqual(getDefaultNoteContent());
    expect(parseNoteContentJson(JSON.stringify(null))).toEqual(getDefaultNoteContent());
  });
});
