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
  const router = useRouter();

  const { data, isLoading } = api.blogs.getOneById.useQuery(
    {
      id,
    },
    {
      onSuccess: (data) => {
        setValue(data!.content);
      },
    }
  );

  const { mutate: editPost, isLoading: isSaving } = api.blogs.edit.useMutation({
    onSuccess: () => {
      toast.success("Saved successfully.");
      void router.push(`/post/${id}`);
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
      <div className="mx-auto w-10/12 py-10 text-cyan-950">
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={isSaving}
            className="flex w-20 items-center justify-center rounded-3xl bg-emerald-400  px-4 py-2 font-display font-bold text-white hover:bg-emerald-500"
            onClick={() => {
              editPost({ id, content: value });
            }}
          >
            {isSaving ? <LoadingSpinner size={24} /> : "Edit"}
          </button>
        </div>
        <h1 className="pb-4 font-display text-2xl font-bold">{data.title}</h1>
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
