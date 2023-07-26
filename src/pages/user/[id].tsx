import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";

const UserPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.blogs.getAllByUserId.useQuery({ id });

  if (!data) return <div>404</div>;

  const { user, posts } = data;

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>{user.name} | Kaku Blogs</title>
      </Head>
      <div className="flex flex-col items-center">
        <img className="h-16 w-16" src={user.image ? user.image : ""} />
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Posts published</h2>
          {posts.map((post) => {
            return (
              <Link key={post.id} href={`/post/${post.id}`}>
                {post.title}
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
