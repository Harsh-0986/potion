import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "katex/dist/katex.min.css";
import Mathematics from "@tiptap-pro/extension-mathematics";
import html2pdf from "html2pdf.js";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";

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

  const extensions = [
    StarterKit,
    Highlight,
    Typography,
    Mathematics,
    Blockquote,
    Link.configure({
      HTMLAttributes: {
        class: "link-styles",
      },
    }),
  ];

  // Mathematics Configuration
  Mathematics.configure({
    shouldRender: (state, pos, node) => {
      const $pos = state.doc.resolve(pos);
      return node.type.name === "text" && $pos.parent.type.name !== "codeBlock";
    },
  });

  // Link configuration
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

  const handleDownload = () => {
    const worker = html2pdf();
    worker
      .from(document.getElementById("editorComponent"))
      .save(`${title}.pdf`);
  };

  if (!editor)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="h-24 w-24 border-8 self-center rounded-full border-r-black animate-spin"></div>
      </div>
    );

  return (
    <>
      <span
        onClick={() => handleDownload()}
        className="flex gap-1 absolute rounded-md top-10 right-8 p-2 border hover:scale-105 border-zinc-800 transition-all cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
          />
        </svg>{" "}
        PDF
      </span>

      <div className="max-h-screen max-w-7xl mx-auto overflow-y-auto py-12">
        <div
          id="editorComponent"
          className="m-1 p-2 min-h-screen text-start gap-3"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title...."
            className="max-h-fit w-full font-bold text-4xl text-center focus:ring-none focus:outline-none"
          />
          <hr className="my-4" />
          <BubbleMenu editor={editor}>
            <div className="z-50 px-4 py-2 rounded-md text-md bg-zinc-800 text-white flex gap-2 items-center justify-center w-fit">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("bold") ? "font-semibold" : ""
                }
              `}
              >
                Bold
              </button>

              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("italic") ? "is-active font-semibold" : ""
                }
              `}
              >
                Italic
              </button>

              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("strike") ? "is-active font-semibold" : ""
                }
              `}
              >
                Strike
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("blockquote") ? "is-active font-semibold" : ""
                }
              `}
              >
                Blockquote
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("bulletList") ? "is-active font-semibold" : ""
                }
              `}
              >
                List
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`transition-all pr-2 border-r border-white ${
                  editor.isActive("codeBlock") ? "is-active font-semibold" : ""
                }
              `}
              >
                Code
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`transition-all ${
                  editor.isActive("highlight") ? "is-active font-semibold" : ""
                }
              `}
              >
                Highlight
              </button>
            </div>
          </BubbleMenu>
          <EditorContent className="py-4 text-center" editor={editor} />
        </div>
        <span
          className={
            `${!saving ? "opacity-0" : ""}` +
            "absolute text-right top-0 left-0 right-0 px-12 py-4 transition-all text-zinc-800 "
          }
        >
          Saving...
        </span>
      </div>
    </>
  );
};

export default MDEditor;
