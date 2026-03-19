import StarterKit from "@tiptap/starter-kit";

export function createNoteEditorExtensions() {
  return [
    StarterKit.configure({
      link: {
        openOnClick: false,
        defaultProtocol: "https",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
        isAllowedUri: (url, context) => {
          if (!context.defaultValidate(url)) {
            return false;
          }

          try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
          } catch {
            return false;
          }
        },
      },
    }),
  ];
}
