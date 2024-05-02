import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "katex/dist/katex.min.css";
import Mathematics from "@tiptap-pro/extension-mathematics";

const MDEditor = ({ noteId }: { noteId: string }) => {
  const { notes, setNotes } = useLocalStorage();

  const note = notes?.filter((note) => note.id === noteId)[0];

  const [title, setTitle] = useState(note?.title || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    updateNotes(note?.content || "");
  }, [title]);

  const updateNotes = (content: string) => {
    setSaving(false);
    setNotes((prev) => {
      const filteredNotes = prev?.filter((curr) => curr.id !== noteId) || [];
      filteredNotes.push({
        id: noteId,
        content: content,
        date: new Date().getTime().toString(),
        title: title,
      });
      return filteredNotes;
    });
  };

  const extensions = [StarterKit, Highlight, Typography, Mathematics];

  Mathematics.configure({
    shouldRender: (state, pos, node) => {
      const $pos = state.doc.resolve(pos);
      return node.type.name === "text" && $pos.parent.type.name !== "codeBlock";
    },
  });

  const updateContent = useDebouncedCallback((content) => {
    updateNotes(content);
  }, 5000);

  const editor = useEditor({
    content: `${note?.content}` || "",
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "marker:text-zinc-900 h-full prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none active:outline-none focus:ring-none",
      },
    },
    onDestroy: () => {
      const content = editor?.getHTML();
      content && updateNotes(content);
    },
    onUpdate: () => {
      setSaving(true);
      const content = editor?.getHTML();
      content && updateContent(content);
    },
  });

  return (
    <div className="max-h-screen overflow-y-auto py-12">
      <div className="bg-zinc-100 p-2 min-h-screen flex flex-col items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title...."
          className="w-full font-bold text-4xl bg-zinc-100 text-center focus:ring-none focus:outline-none"
        />
        <EditorContent className="text-center" editor={editor} />
      </div>
      <span
        className={
          `${!saving ? "opacity-0" : ""}` +
          "absolute text-right top-0 left-0 right-0 px-12 py-4 bg-zinc-100 transition-all text-zinc-800 "
        }
      >
        Saving...
      </span>
    </div>
  );
};

export default MDEditor;
