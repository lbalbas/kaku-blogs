import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getOneById.useQuery({ id });
  if (!data) return <div>404</div>;

  const { title, content } = data;
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className="text-2xl ">{title}</h1>
      <div>{parse(content)}</div>
    </div>
  );
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

export default BlogPost;
