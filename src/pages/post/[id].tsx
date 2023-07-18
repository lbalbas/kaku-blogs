import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingBlock from "~/components/loading";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const {data} = api.blogs.getOne.useQuery({ id });
  if (!data) return <div>404</div>

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
  }
;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.blogs.getOne.prefetch({id});
  
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
