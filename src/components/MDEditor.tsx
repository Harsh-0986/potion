import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { NoteType } from "../types";

const MDEditor = ({ note }: { note: NoteType }) => {
  const extensions = [StarterKit, Highlight, Typography];

  const editor = useEditor({
    content: note.content,
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none active:outline-none focus:ring-none",
      },
    },
  });

  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="bg-zinc-100 p-2 min-h-screen">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default MDEditor;
