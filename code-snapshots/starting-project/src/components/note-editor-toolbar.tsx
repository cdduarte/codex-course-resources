"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";

type NoteEditorToolbarProps = {
  editor: Editor;
};

const BASE_BUTTON_CLASS =
  "rounded-md border border-(--border) px-2.5 py-1.5 text-xs font-semibold transition";
const INACTIVE_BUTTON_CLASS =
  "bg-(--surface-muted) text-(--text-muted) hover:bg-(--surface-strong) hover:text-foreground";
const ACTIVE_BUTTON_CLASS = "bg-(--accent) text-(--accent-foreground)";

function ToolbarButton({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  const className = `${BASE_BUTTON_CLASS} ${isActive ? ACTIVE_BUTTON_CLASS : INACTIVE_BUTTON_CLASS}`;

  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export function NoteEditorToolbar({ editor }: NoteEditorToolbarProps) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return {
          bold: false,
          italic: false,
          strike: false,
          heading2: false,
          bulletList: false,
          orderedList: false,
          blockquote: false,
          codeBlock: false,
          link: false,
        };
      }

      return {
        bold: currentEditor.isActive("bold"),
        italic: currentEditor.isActive("italic"),
        strike: currentEditor.isActive("strike"),
        heading2: currentEditor.isActive("heading", { level: 2 }),
        bulletList: currentEditor.isActive("bulletList"),
        orderedList: currentEditor.isActive("orderedList"),
        blockquote: currentEditor.isActive("blockquote"),
        codeBlock: currentEditor.isActive("codeBlock"),
        link: currentEditor.isActive("link"),
      };
    },
  });

  function handleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function handleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function handleStrike() {
    editor.chain().focus().toggleStrike().run();
  }

  function handleHeading() {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function handleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function handleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }

  function handleBlockquote() {
    editor.chain().focus().toggleBlockquote().run();
  }

  function handleCodeBlock() {
    editor.chain().focus().toggleCodeBlock().run();
  }

  function handleLink() {
    const previousHref = editor.getAttributes("link").href as string | undefined;
    const nextHref = window.prompt("Enter a link (http:// or https://)", previousHref ?? "");

    if (nextHref === null) {
      return;
    }

    if (!nextHref.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: nextHref.trim() }).run();
  }

  function handleClearFormatting() {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-t-xl border border-(--border) bg-(--surface-muted) p-3">
      <ToolbarButton isActive={editorState.bold} label="Bold" onClick={handleBold} />
      <ToolbarButton isActive={editorState.italic} label="Italic" onClick={handleItalic} />
      <ToolbarButton isActive={editorState.strike} label="Strike" onClick={handleStrike} />
      <ToolbarButton isActive={editorState.heading2} label="Heading" onClick={handleHeading} />
      <ToolbarButton isActive={editorState.bulletList} label="Bullets" onClick={handleBulletList} />
      <ToolbarButton
        isActive={editorState.orderedList}
        label="Numbered"
        onClick={handleOrderedList}
      />
      <ToolbarButton isActive={editorState.blockquote} label="Quote" onClick={handleBlockquote} />
      <ToolbarButton isActive={editorState.codeBlock} label="Code" onClick={handleCodeBlock} />
      <ToolbarButton isActive={editorState.link} label="Link" onClick={handleLink} />
      <button
        type="button"
        className={`${BASE_BUTTON_CLASS} ${INACTIVE_BUTTON_CLASS}`}
        onClick={handleClearFormatting}
      >
        Clear marks
      </button>
    </div>
  );
}
