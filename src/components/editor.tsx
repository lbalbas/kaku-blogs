import dynamic from "next/dynamic";
import { useState } from "react";
import { api } from "~/utils/api";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
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
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
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

export default function Editor() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const { mutate, isLoading: isPosting } = api.blogs.publish.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to post! Please try again later.");
      }
    },
  });
  return (
    <div>
      <input onChange={(e) => setTitle(e.target.value)} type="Text" />
      <QuillNoSSRWrapper
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
