import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { NoteType } from "../types";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MDEditor = ({ note }: { note: NoteType }) => {
  const { setNotes } = useLocalStorage();
  const extensions = [StarterKit, Highlight, Typography];

  const titleRef = useRef<HTMLInputElement>(null);

  if (titleRef.current) {
    titleRef.current.value = note.title;
  }

  const updateContent = useDebouncedCallback((content) => {
    setNotes((prev) => {
      const notes = prev?.filter((curr) => curr.id !== note.id) || [];
      notes.push({
        ...note,
        date: new Date().getTime().toString(),
        content: content,
      });
      return notes;
    });
  }, 5000);

  const editor = useEditor({
    content: `${note.content}`,
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "marker:text-zinc-900 h-full prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none active:outline-none focus:ring-none",
      },
    },
    onDestroy: () => {
      const content = editor?.getHTML();
      setNotes((prev) => {
        const notes = prev?.filter((curr) => curr.id !== note.id) || [];
        notes.push({
          ...note,
          content: content || note.content,
          date: new Date().getTime().toString(),
        });
        return notes;
      });
    },
    onUpdate: () => {
      updateContent(editor?.getHTML());
    },
  });

  return (
    <div className="max-h-screen overflow-y-auto py-12">
      <div className="bg-zinc-100 p-2 min-h-screen flex flex-col items-center gap-3">
        <input
          type="text"
          ref={titleRef}
          placeholder="Enter a title...."
          className="w-full font-bold text-4xl bg-zinc-100 text-center focus:ring-none focus:outline-none"
        />
        <EditorContent className="text-center" editor={editor} />
      </div>
    </div>
  );
};

export default MDEditor;
