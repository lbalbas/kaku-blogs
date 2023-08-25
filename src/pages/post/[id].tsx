import Head from "next/head";
import { api } from "~/utils/api";
import parse from "html-react-parser";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import Comments from "~/components/comments";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getOneById.useQuery({ id });
  if (!data) return <div>404</div>;

  const { title, content, publishedAt } = data;
  return (
    <div className="mx-auto flex w-10/12 flex-col py-10 md:w-9/12">
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className="w-full font-display text-3xl font-bold text-cyan-950">
        {title}
      </h1>
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
          <span className="text-sm text-slate-500">{`${dayjs().to(
            dayjs(publishedAt)
          )}`}</span>
        </div>
      </div>
      <div className="border-b-2 border-slate-100 py-4 text-justify leading-relaxed text-cyan-950">
        {parse(content)}
      </div>
      <Comments post={data.id} />
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
