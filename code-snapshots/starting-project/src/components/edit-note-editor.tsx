"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { parseNoteContentJson } from "@/src/lib/note-content";
import { createNoteEditorExtensions } from "./note-editor-extensions";
import { NoteEditorToolbar } from "./note-editor-toolbar";

const AUTOSAVE_DELAY_MS = 1000;

type SaveState = "saved" | "unsaved" | "saving" | "error";

type EditNoteEditorProps = {
  noteId: string;
  initialTitle: string;
  initialContentJson: string;
  initialUpdatedAt: string;
  saveAction: (input: { id: string; title?: string; contentJson?: unknown }) => Promise<
    | {
        ok: true;
        note: {
          id: string;
          title: string;
          updatedAt: string;
        };
      }
    | {
        ok: false;
        error: {
          code: string;
          message: string;
        };
      }
  >;
};

function formatSavedTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function serializeSnapshot(title: string, contentJson: unknown): string {
  return JSON.stringify({
    title: title.trim(),
    contentJson,
  });
}

export function EditNoteEditor({
  noteId,
  initialTitle,
  initialContentJson,
  initialUpdatedAt,
  saveAction,
}: EditNoteEditorProps) {
  const initialContent = parseNoteContentJson(initialContentJson);
  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState(initialUpdatedAt);
  const extensions = useMemo(() => createNoteEditorExtensions(), []);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRequestIdRef = useRef(0);
  const lastSavedSnapshotRef = useRef(serializeSnapshot(initialTitle, initialContent));

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialContent,
    onUpdate: () => {
      setSaveState("unsaved");
      queueAutosave();
    },
  });

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  function queueAutosave() {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      void flushSave();
    }, AUTOSAVE_DELAY_MS);
  }

  async function flushSave() {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    if (!editor) {
      return;
    }

    const contentJson = editor.getJSON();
    const nextSnapshot = serializeSnapshot(title, contentJson);

    if (nextSnapshot === lastSavedSnapshotRef.current) {
      setSaveState("saved");
      return;
    }

    setErrorMessage(null);
    setSaveState("saving");

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    const result = await saveAction({
      id: noteId,
      title,
      contentJson,
    });

    if (requestId !== latestRequestIdRef.current) {
      return;
    }

    if (!result.ok) {
      setSaveState("error");
      setErrorMessage(result.error.message);
      return;
    }

    lastSavedSnapshotRef.current = nextSnapshot;
    setLastSavedAt(result.note.updatedAt);
    setSaveState("saved");
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setErrorMessage(null);
    setSaveState("unsaved");
    queueAutosave();
  }

  function handleSaveClick() {
    void flushSave();
  }

  const saveStateLabel =
    saveState === "saved"
      ? "Saved"
      : saveState === "unsaved"
        ? "Unsaved changes"
        : saveState === "saving"
          ? "Saving"
          : "Error";

  const saveButtonDisabled = saveState === "saving" || !editor;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{saveStateLabel}</p>
          <p className="text-xs text-(--text-muted)">
            Last saved {formatSavedTimestamp(lastSavedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={saveButtonDisabled}
          className="rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110 disabled:opacity-70"
        >
          {saveState === "saving" ? "Saving..." : "Save"}
        </button>
      </div>

      <label className="block text-sm font-semibold text-foreground" htmlFor="edit-note-title">
        Title
      </label>
      <input
        id="edit-note-title"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled note"
        className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm text-foreground outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/40"
      />

      {editor ? (
        <div className="overflow-hidden rounded-xl border border-(--border)">
          <NoteEditorToolbar editor={editor} />
          <EditorContent
            editor={editor}
            className="min-h-[24rem] bg-(--surface) px-4 py-3 [&_.ProseMirror]:min-h-[22rem] [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_a]:text-(--accent) [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-(--border) [&_.ProseMirror_blockquote]:pl-3"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-10 text-sm text-(--text-muted)">
          Loading editor...
        </div>
      )}

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
