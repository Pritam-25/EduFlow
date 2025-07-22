import { generateHTML } from '@tiptap/html/server'
import React, { useMemo } from 'react'
import { type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import parse from 'html-react-parser';

export function RenderDescription({json}:{json: JSONContent}) {

  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      })
    ])
  }, [json])

  return (
    <div className="prose dark:prose-invert prose-headings:font-bold  prose-p:text-muted-foreground  prose-a:no-underline hover:prose-a:underline">
      {parse(output)}
    </div>
  )
}

