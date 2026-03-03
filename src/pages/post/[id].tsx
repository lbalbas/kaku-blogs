import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import Comments from "~/components/comments";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import Image from "next/image";

dayjs.extend(relativeTime);

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getOneById.useQuery({ id });
  if (!data) return <div>404</div>;

  const { title, content, publishedAt } = data;
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-white dark:bg-slate-950">
      <div className="flex w-10/12 flex-col py-10 md:w-9/12">
        <Head>
          <title>{title}</title>
        </Head>
        <h1 className="w-full font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
          {title}
        </h1>
        <div className="my-6 flex w-fit items-center gap-4">
          <Image
            width={36}
            height={36}
            className="rounded-full"
            src={data.user.image!}
            alt="Author's profile picture"
          />
          <div className="flex flex-col">
            <Link
              className="font-bold text-slate-700 transition-colors hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400"
              href={`/user/${data.user.id}`}
            >
              {data.user.name}
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">{`${dayjs().to(
              dayjs(publishedAt)
            )}`}</span>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none border-b border-slate-100 py-8 text-lg leading-relaxed text-slate-800 dark:border-slate-800 dark:text-slate-200">
          {parse(content)}
        </div>
        <Comments post={data.id} />
      </div>
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
