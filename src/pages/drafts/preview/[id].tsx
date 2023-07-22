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
    <div className="flex flex-col items-center">
      <Head>
        <title>{title} | Draft</title>
      </Head>
      <Link href={`/drafts/${id}`}>Go back to Editor</Link>
      <h1 className="text-2xl ">{title}</h1>
      <div>{parse(content)}</div>
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
