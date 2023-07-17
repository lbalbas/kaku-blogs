import dynamic from "next/dynamic";
import { useState, useRef, useCallback } from "react";
import { api } from "~/utils/api";

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
  getEditor: () => any;
  theme: {
    tooltip: any;
  };
};

export default function Editor() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const quillRef = useRef<QuillInstance | null>(null);
  const { mutate, isLoading: isPosting } = api.blogs.publish.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to post! Please try again later.");
      }
    },
  });

  const imageHandler = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const tooltip = quill.theme.tooltip;
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
    <div>
      <input onChange={(e) => setTitle(e.target.value)} type="Text" />
      <QuillNoSSRWrapper
        forwardedRef={quillRef}
        placeholder="Start writing your Blog Post here"
        modules={modules}
        value={value}
        onChange={setValue}
        formats={formats}
        theme="snow"
      />
      <button
        onClick={() => {
          mutate({ title: title, content: value });
        }}
      >
        Post
      </button>
    </div>
  );
}
