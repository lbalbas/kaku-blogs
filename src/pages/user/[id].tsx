import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const UserPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getAllByUserId.useQuery({ id });

  if (!data) return <div>404</div>;

  const { user, posts } = data;

  return (
    <div className="mx-auto flex w-10/12 flex-col py-10">
      <Head>
        <title>{user.name} | Kaku Blogs</title>
      </Head>
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="flex flex-col items-center gap-2">
          <img
            className="h-24 w-24 rounded-full"
            src={user.image ? user.image : ""}
          />
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
        <div className="flex flex-grow flex-col gap-3">
          <h2 className="text-2xl">Posts published</h2>
          {posts.map((post) => {
            return (
              <Link
                className="flex flex-col justify-center border-l-4 border-uviolet p-3 pl-4 text-lg"
                key={post.id}
                href={`/post/${post.id}`}
              >
                {post.title}
                <span className="text-xs italic text-slate-500">{`${dayjs().to(
                  dayjs(post.publishedAt)
                )}`}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.blogs.getAllByUserId.prefetch({ id });

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

export default UserPage;
