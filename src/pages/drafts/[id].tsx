import Editor from "~/components/editor";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingBlock from "~/components/loading";
import { TRPCError } from "@trpc/server";
import { useState } from "react";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";

const DraftEditor: NextPage<{ id: string }> = ({ id }) => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();

  const { data } = api.drafts.getOneById.useQuery(
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
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
        } else {
          console.log("Failed to post! Please try again later.");
        }
      },
    });

  const { mutate: saveDraft, isLoading: isSaving } =
    api.drafts.save.useMutation({
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
      <div className="flex items-center justify-between">
        <div className="flex flex-grow flex-col">
          <span className="font-bold">Title</span>
          <input
            className="rounded-lg border-2 border-slate-200 px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="Text"
          />
        </div>
        <div>
          <a target="_blank" href={`/drafts/preview/${id}`}>
            Preview
          </a>
          <button
            onClick={() => {
              saveDraft({ id, title: title, content: value });
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              publishDraft({ draftId: id, title: title, content: value });
            }}
          >
            Publish
          </button>
        </div>
      </div>
      <Editor value={value} setValue={setValue} />
      <p className="text-center text-xs text-slate-400">
        {"Please preview your post before publishing, as the result doesn't always match what you see in the editor"}
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
