import Editor from "~/components/editor";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingBlock from "~/components/loading";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import toast from "react-hot-toast";

const PostEditor: NextPage<{ id: string }> = ({ id }) => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  const ctx = api.useContext();

  const { data, isLoading } = api.blogs.getOneById.useQuery(
    {
      id,
    },
    {
      onSuccess: (data) => {
        setValue(data!.content);
        setTitle(data!.title);
      },
    }
  );

  const { mutate: editPost, isLoading: isSaving } =
    api.blogs.edit.useMutation({
      onSuccess: () => {
        toast.success("Saved successfully.");
        void router.push(`/post/${id}`)
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to save! Please try again later.");
        }
      },
    });

  if (isLoading) return <LoadingBlock size={24} />;

  if (data)
    return (
      <div className="mx-auto w-10/12 py-10">
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={isSaving}
            className="flex w-20 items-center justify-center  rounded-3xl bg-emerald-400 px-4 py-2 text-white"
            onClick={() => {
              editPost({ id, title: title, content: value });
            }}
          >
            {isSaving ? <LoadingSpinner size={24} /> : "Save Changes"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-grow flex-col">
            <span className="font-bold">Title</span>
            <input
              className="rounded-lg border-2 border-slate-200 px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
            />
          </div>
        </div>
        <Editor value={value} setValue={setValue} />
      </div>
    );

  return <div>404</div>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.blogs.getOneById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostEditor;
