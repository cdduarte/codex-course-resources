export type NoteContentJson = Record<string, unknown>;

const EMPTY_NOTE_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
} as const;

export function getDefaultNoteContent(): NoteContentJson {
  return { ...EMPTY_NOTE_CONTENT, content: [...EMPTY_NOTE_CONTENT.content] };
}

export function parseNoteContentJson(contentJson: string): NoteContentJson {
  try {
    const parsed = JSON.parse(contentJson);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return getDefaultNoteContent();
    }
    return parsed as NoteContentJson;
  } catch {
    return getDefaultNoteContent();
  }
}
