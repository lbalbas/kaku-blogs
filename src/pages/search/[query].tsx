import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const Search: NextPage<{ query: string }> = ({ query }) => {
  const { data } = api.blogs.search.useQuery({ query });

  if (!data || data.length == 0) return <div>No matching results :(</div>;
  return (
    <div className="mx-auto flex w-9/12 flex-col py-16">
      <Head>
        <title>{`Searching ${query}`}</title>
      </Head>
      <h1 className="w-full text-3xl font-bold">{`Searching ${query}`}</h1>
      <div className="flex flex-col gap-4">
        {data.map((post) => {
          return (
            <div className="flex flex-col" key={post.id}>
              <Link className="text-xl font-bold" href={`/post/${post.id}`}>
                {post.title}
              </Link>
              <Link href={`/user/${post.user.id}`} className="flex gap-2">
                <img
                  className="h-6 w-6 rounded-full"
                  src={post.user.image!}
                  alt={`${post.user.name} profile's picture`}
                />
                <span>{post.user.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const query = context.params?.query;

  if (typeof query !== "string") throw new Error("No query");

  await ssg.blogs.search.prefetch({ query });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Search;
