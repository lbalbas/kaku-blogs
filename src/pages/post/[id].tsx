import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getOneById.useQuery({ id });
  if (!data) return <div>404</div>;

  const { title, content, publishedAt } = data;
  return (
    <div className="mx-auto flex w-9/12 flex-col py-16">
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className="w-full text-3xl font-bold">{title}</h1>
      <div className="my-6 flex w-fit items-center gap-4">
        <img
          className="h-10 w-10 rounded-full"
          src={data.user.image!}
          alt="Author's profile picture"
        />
        <div className="flex flex-col">
          <Link className="font-bold" href={`/user/${data.user.id}`}>
            {data.user.name}
          </Link>
          <span className="text-sm text-slate-500">{`${dayjs().to(
            dayjs(publishedAt)
          )}`}</span>
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
