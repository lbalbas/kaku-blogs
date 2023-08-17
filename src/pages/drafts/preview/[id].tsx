import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";

const DraftPreview: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.drafts.getOneById.useQuery({ id });
  if (!data) return <div>404</div>;

  const { title, content } = data;
  return (
    <div className="mx-auto flex w-9/12 flex-col">
      <Head>
        <title>{title}</title>
      </Head>
      <Link href={`/drafts/${id}`}>Go back to editor</Link>
      <h1 className="w-full text-3xl font-bold">{title}</h1>
      <div className="my-6 flex w-fit items-center gap-4">
        <img
          className="h-10 w-10 rounded-full"
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
      <div className="my-4 text-justify leading-relaxed">{parse(content)}</div>
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
