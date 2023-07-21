import dynamic from "next/dynamic";
import { useState, useRef, useCallback } from "react";
import type { Quill } from "quill";

type QuillProps = {
  forwardedRef: React.Ref<any>;
  [key: string]: any;
};

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const Component = ({ forwardedRef, ...props }: QuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
    Component.displayName = "QuillNoSSRWrapper";
    return Component;
  },
  { ssr: false }
);

type QuillInstance = {
  getEditor: () => QuillWTheme;
};

type Tooltip = {
  save: () => void;
  hide: () => void;
  edit: (mode: string) => void;
  quill: Quill;
  textbox: HTMLInputElement;
};

interface QuillWTheme extends Quill {
  theme?: {
    tooltip: Tooltip;
    [key: string]: any;
  };
}

interface EditorProps {
  value: string,
  setValue: (arg0:string)=>void,
}

export default function Editor(props: EditorProps) {
  const {value, setValue} = props;
  const quillRef = useRef<QuillInstance | null>(null);

  const imageHandler = useCallback(() => {
    if (quillRef.current) {
      const quill: QuillWTheme = quillRef.current.getEditor();
      const tooltip: Tooltip | undefined = quill.theme?.tooltip;
      if (tooltip) {
        const originalSave = tooltip.save;
        const originalHide = tooltip.hide;

        tooltip.save = function () {
          const range = this.quill.getSelection(true);
          const value = this.textbox.value;
          if (value) {
            this.quill.insertEmbed(range.index, "image", value, "user");
          }
        };

        tooltip.hide = function () {
          tooltip.save = originalSave;
          tooltip.hide = originalHide;
          tooltip.hide();
        };

        tooltip.edit("image");
        tooltip.textbox.placeholder = "Embed URL";
      }
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
      <QuillNoSSRWrapper
        forwardedRef={quillRef}
        placeholder="Start writing your Blog Post here"
        modules={modules}
        value={value}
        onChange={setValue}
        formats={formats}
        theme="snow"
      />
  );
}
