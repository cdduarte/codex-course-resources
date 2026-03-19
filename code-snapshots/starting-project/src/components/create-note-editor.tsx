"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useActionState, useMemo, useState, type ChangeEvent } from "react";
import { getDefaultNoteContent } from "@/src/lib/note-content";
import { createNoteEditorExtensions } from "./note-editor-extensions";
import { NoteEditorToolbar } from "./note-editor-toolbar";

export type CreateNoteFormState = {
  errorMessage: string | null;
};

const INITIAL_FORM_STATE: CreateNoteFormState = {
  errorMessage: null,
};

type CreateNoteEditorProps = {
  createAction: (
    previousState: CreateNoteFormState,
    formData: FormData,
  ) => Promise<CreateNoteFormState>;
};

export function CreateNoteEditor({ createAction }: CreateNoteEditorProps) {
  const [title, setTitle] = useState("");
  const [contentJson, setContentJson] = useState(JSON.stringify(getDefaultNoteContent()));
  const [state, formAction, isPending] = useActionState(createAction, INITIAL_FORM_STATE);
  const extensions = useMemo(() => createNoteEditorExtensions(), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: getDefaultNoteContent(),
    onUpdate: ({ editor: currentEditor }) => {
      setContentJson(JSON.stringify(currentEditor.getJSON()));
    },
  });

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleClear() {
    setTitle("");
    setContentJson(JSON.stringify(getDefaultNoteContent()));
    if (!editor) {
      return;
    }

    editor.commands.setContent(getDefaultNoteContent(), { emitUpdate: false });
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-3">
        <p className="text-sm font-semibold text-(--text-muted)">Ready to submit</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm font-semibold text-foreground transition hover:brightness-105"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-(--accent-foreground) transition hover:brightness-110 disabled:opacity-70"
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <label className="block text-sm font-semibold text-foreground" htmlFor="new-note-title">
        Title
      </label>
      <input
        id="new-note-title"
        name="title"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled note"
        className="w-full rounded-lg border border-(--border) bg-(--surface-strong) px-3 py-2 text-sm text-foreground outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/40"
      />

      <input type="hidden" name="contentJson" value={contentJson} />

      {editor ? (
        <div className="overflow-hidden rounded-xl border border-(--border)">
          <NoteEditorToolbar editor={editor} />
          <EditorContent
            editor={editor}
            className="min-h-[24rem] bg-(--surface) px-4 py-3 [&_.ProseMirror]:min-h-[22rem] [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_a]:text-(--accent) [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-(--border) [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-(--text-muted) [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-(--border) bg-(--surface-muted) px-4 py-10 text-sm text-(--text-muted)">
          Loading editor...
        </div>
      )}

      {state.errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
