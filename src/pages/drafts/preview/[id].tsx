import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const DraftPreview: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.drafts.getOneById.useQuery(
    { id },
    {
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to fetch! Please try again later.");
        }
      },
    }
  );

  if (!data)
    return (
      <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold">
        404 - Not Found
      </div>
    );

  const { title, content } = data;
  return (
    <div className="mx-auto flex w-10/12 flex-col py-10 md:w-9/12">
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className="w-full font-display text-3xl font-bold text-cyan-950">
        {title}
      </h1>
      <div className="my-6 flex w-fit items-center gap-4">
        <Image
          width={32}
          height={32}
          className="rounded-full"
          src={data.user.image!}
          alt="Author's profile picture"
        />
        <div className="flex flex-col">
          <Link
            className="font-bold text-slate-600"
            href={`/user/${data.user.id}`}
          >
            {data.user.name}
          </Link>
          <span className="text-sm text-slate-500">5 minutes ago</span>
        </div>
      </div>
      <div className="border-b-2 border-slate-100 py-4 text-justify leading-relaxed text-cyan-950">
        {parse(content)}
      </div>
      <Link
        className="my-2 w-fit rounded-full bg-black p-2 px-3 text-white"
        href={`/drafts/${id}`}
      >
        Go back to editor
      </Link>
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

export default DraftPreview;
