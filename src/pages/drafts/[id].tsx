import Editor from "~/components/editor";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingBlock from "~/components/loading";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import toast from "react-hot-toast";

const DraftEditor: NextPage<{ id: string }> = ({ id }) => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  const ctx = api.useContext();

  const { data, isLoading } = api.drafts.getOneById.useQuery(
    {
      id,
    },
    {
      onSuccess: (data) => {
        setValue(data.content);
        setTitle(data.title);
      },
    }
  );

  const { mutate: publishDraft, isLoading: isPosting } =
    api.blogs.publish.useMutation({
      onSuccess: (data) => {
        toast.success("Published successfully, redirecting to post.");
        void router.push(`/post/${data[0].id}`);
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to publish! Please try again later.");
        }
      },
    });

  const { mutate: saveDraft, isLoading: isSaving } =
    api.drafts.save.useMutation({
      onSuccess: () => {
        toast.success("Saved successfully.");
        void ctx.drafts.getOneById.invalidate();
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

  const { mutate: deleteDraft, isLoading: isDeleting } =
    api.drafts.delete.useMutation({
      onSuccess: () => {
        toast.success("Deleted successfully, redirecting to draft list");
        void router.push("/drafts");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to delete! Please try again later.");
        }
      },
    });

  if (isLoading) return <LoadingBlock size={24} />;

  if (!data)
    return (
      <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold">
        404 - Not Found
      </div>
    );

  return (
    <div className="mx-auto w-10/12 py-10 text-cyan-950">
      <div className="flex items-center justify-end gap-2">
        <button
          disabled={isSaving || isPosting || isDeleting}
          className="mr-4 flex w-20 items-center justify-center  rounded-3xl px-4 py-2 hover:bg-red-400 hover:text-white"
          onClick={() => {
            if (confirm("Are you sure you want to delete this draft?"))
              deleteDraft({ id });
          }}
        >
          {isDeleting ? <LoadingSpinner size={24} /> : "Delete"}
        </button>
        <button
          className="hover:underline"
          disabled={isSaving || isPosting || isDeleting}
          onClick={() => {
            if (value !== data.content || title !== data.title) {
              toast.error("Please save your changes before previewing.");
              return;
            }
            void router.push(`/drafts/preview/${id}`);
          }}
        >
          Preview
        </button>
        <button
          disabled={isSaving || isPosting || isDeleting}
          className="flex w-20 items-center justify-center  rounded-3xl bg-emerald-400 px-4 py-2 text-white"
          onClick={() => {
            saveDraft({ id, title: title, content: value });
          }}
        >
          {isSaving ? <LoadingSpinner size={24} /> : "Save"}
        </button>
        <button
          disabled={isSaving || isPosting || isDeleting}
          className="flex items-center justify-center rounded-3xl bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-800"
          onClick={() => {
            publishDraft({ draftId: id, title: title, content: value });
          }}
        >
          {isPosting ? <LoadingSpinner size={24} /> : "Publish"}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-grow flex-col pb-4 font-display">
          <span className="text-xl font-bold">Title</span>
          <input
            className="rounded-lg border-2 border-slate-200 px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
        </div>
      </div>
      <Editor value={value} setValue={setValue} />
      <p className="mx-auto text-center text-xs text-slate-400 md:w-10/12">
        {
          "You will need to save all changes made before previewing. Please always preview your post before publishing, as the result doesn't always match what you see in the editor"
        }
      </p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.drafts.getOneById.prefetch({ id });

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

export default DraftEditor;
