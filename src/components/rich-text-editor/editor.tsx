"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./menubar";
import Highlight from "@tiptap/extension-highlight";

interface TiptapProps {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    name?: string;
  };
}

const Tiptap = ({ field }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure(),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] px-4 py-2 focus:outline-none prose dark:prose-invert max-w-none text-base leading-normal prose-p:my-2 prose-h1:my-4 prose-h2:my-3 prose-h3:my-2 prose-ul:my-2 prose-li:my-1",
      },
    },
    immediatelyRender: false,

    content: field.value
      ? JSON.parse(field.value)
      : `<p>🚀 Enter your course description here...</p>
`,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="w-full border border-input rounded-lg bg-input/30 overflow-hidden">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
