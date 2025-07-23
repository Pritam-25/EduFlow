import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  ListIcon,
  ListOrdered,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Undo,
  Redo,
  Italic,
  Highlighter,
} from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

export function Menubar({ editor }: MenubarProps) {
  if (!editor) return null;

  return (
    <div className="border border-input rounded-t-0 border-x-0 bg-card p-2 flex flex-wrap items-center gap-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-2">
          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          {/* Italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editor.isActive("italic") && "bg-muted text-muted-foreground"
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          {/* Strike */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editor.isActive("strike") && "bg-muted text-muted-foreground"
                )}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>

          {/* Highlight */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("highlight")}
                onPressedChange={() =>
                  editor.chain().focus().toggleHighlight().run()
                }
                className={cn(
                  editor.isActive("highlight") && "bg-yellow-200 text-black"
                )}
              >
                <Highlighter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Highlight</TooltipContent>
          </Tooltip>

          {/* Headings */}
          {([1, 2, 3] as const).map((level) => (
            <Tooltip key={level}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: level }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level }) &&
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {level === 1 ? (
                    <Heading1 />
                  ) : level === 2 ? (
                    <Heading2 />
                  ) : (
                    <Heading3 />
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{`Heading ${level}`}</TooltipContent>
            </Tooltip>
          ))}

          {/* Bullet List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editor.isActive("bulletList") &&
                  "bg-muted text-muted-foreground"
                )}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          {/* Ordered List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editor.isActive("orderedList") &&
                  "bg-muted text-muted-foreground"
                )}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Text Alignment */}
        <div className="flex flex-wrap gap-1">
          {[
            { align: "left", icon: <AlignLeft />, label: "Left Align" },
            { align: "center", icon: <AlignCenter />, label: "Center Align" },
            { align: "right", icon: <AlignRight />, label: "Right Align" },
          ].map(({ align, icon, label }) => (
            <Tooltip key={align}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("textAlign", {
                    textAlign: align as "left" | "center" | "right",
                  })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign(align).run()
                  }
                  className={cn(
                    editor.isActive("textAlign", {
                      textAlign: align as "left" | "center" | "right",
                    }) && "bg-muted text-muted-foreground"
                  )}
                >
                  {icon}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        {/* Undo / Redo */}
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
export default Menubar;