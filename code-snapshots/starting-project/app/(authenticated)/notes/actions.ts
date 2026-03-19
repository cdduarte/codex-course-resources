"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireServerSession } from "@/src/lib/auth-session";
import { NotesValidationError, createUserNote, updateUserNote } from "@/src/lib/notes";

type ActionErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

type ActionError = {
  code: ActionErrorCode;
  message: string;
};

export type CreateNoteActionInput = {
  title?: string;
  contentJson: unknown;
};

export type UpdateNoteActionInput = {
  id: string;
  title?: string;
  contentJson?: unknown;
};

export type UpdateNoteActionResult =
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
      error: ActionError;
    };

type CreateNoteActionResult = {
  ok: false;
  error: ActionError;
};

export type CreateNoteFormState = {
  errorMessage: string | null;
};

const GENERIC_MUTATION_ERROR = "We couldn't save your note. Please try again.";

function toActionError(error: unknown): ActionError {
  if (error instanceof NotesValidationError) {
    return {
      code: "VALIDATION_ERROR",
      message: "Please check your note content and try again.",
    };
  }

  console.error(error);
  return {
    code: "INTERNAL_ERROR",
    message: GENERIC_MUTATION_ERROR,
  };
}

export async function createNoteAction(
  input: CreateNoteActionInput,
): Promise<CreateNoteActionResult> {
  const session = await requireServerSession();
  let createdNoteId: string;

  try {
    const note = createUserNote({
      userId: session.user.id,
      title: input.title,
      contentJson: input.contentJson,
    });

    createdNoteId = note.id;
  } catch (error) {
    return {
      ok: false,
      error: toActionError(error),
    };
  }

  revalidatePath("/notes");
  redirect(`/notes/${createdNoteId}`);
}

export async function createNoteFormAction(
  _previousState: CreateNoteFormState,
  formData: FormData,
): Promise<CreateNoteFormState> {
  const title = formData.get("title");
  const contentJson = formData.get("contentJson");

  if (typeof contentJson !== "string") {
    return {
      errorMessage: "Please add note content before submitting.",
    };
  }

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(contentJson);
  } catch {
    return {
      errorMessage: "Please add note content before submitting.",
    };
  }

  const result = await createNoteAction({
    title: typeof title === "string" ? title : "",
    contentJson: parsedContent,
  });

  return {
    errorMessage: result.error.message,
  };
}

export async function updateNoteAction(
  input: UpdateNoteActionInput,
): Promise<UpdateNoteActionResult> {
  const session = await requireServerSession();

  try {
    const updatedNote = updateUserNote({
      id: input.id,
      userId: session.user.id,
      title: input.title,
      contentJson: input.contentJson,
    });

    if (!updatedNote) {
      return {
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "This note could not be found.",
        },
      };
    }

    revalidatePath("/notes");
    revalidatePath(`/notes/${updatedNote.id}`);

    return {
      ok: true,
      note: {
        id: updatedNote.id,
        title: updatedNote.title,
        updatedAt: updatedNote.updatedAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: toActionError(error),
    };
  }
}
