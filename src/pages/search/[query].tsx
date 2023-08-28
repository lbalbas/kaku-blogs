import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import Image from "next/image";
import {useState} from 'react';
import type {BlogPost, User} from '@prisma/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(relativeTime);

const Search: NextPage<{ query: string }> = ({ query }) => {
  const { data } = api.blogs.search.useQuery({ query });
  const [currentPage, setPage] = useState(0);

  if (!data || data.length == 0)
    return (
      <div className="mx-auto flex w-11/12 flex-col gap-3 py-10 md:w-10/12">
        <Head>
          <title>{`Searching for "${query}"`}</title>
        </Head>
        <h1 className="w-full font-display text-3xl font-bold">{`Searching for "${query}"`}</h1>
        <p className="pt-8">No matching results found</p>
      </div>
    );

  const paginate = (array: (BlogPost & {user: User})[], itemsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < array.length; i += itemsPerPage) {
      pages.push(array.slice(i, i + itemsPerPage));
    }
    return pages;
  }

  const resultPages = paginate(data, 10);

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-3 py-10 md:w-10/12">
      <Head>
        <title>{`Searching for "${query}"`}</title>
      </Head>
      <h1 className="w-full font-display text-3xl font-bold">{`Searching for "${query}"`}</h1>
      <div className="flex flex-col gap-4">
        {resultPages[currentPage]!.map((post) => {
          return (
            <div
              className="flex flex-col justify-center border-l-4 border-red-500 p-3 pl-4 text-cyan-950"
              key={post.id}
            >
              <Link
                href={`/user/${post.user.id}`}
                className="flex w-fit items-center gap-2"
              >
                <Image
                  height={24}
                  width={24}
                  className="rounded-full"
                  src={post.user.image!}
                  alt={`Author's profile picture`}
                />
                <span>{post.user.name}</span>
              </Link>
              <Link
                className="font-display text-xl font-bold"
                href={`/post/${post.id}`}
              >
                {post.title}
              </Link>
              <span className="text-sm text-slate-500">{`${dayjs().to(
                dayjs(post.publishedAt)
              )}`}</span>
            </div>
          );
        })}
          <div className="flex justify-center gap-2 items-center">
            <button disabled={currentPage <= 0} onClick={()=>{setPage(currentPage - 1)}}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>Page {`${currentPage + 1} of ${resultPages.length}`}</span>
            <button disabled={currentPage + 1 >= resultPages.length} onClick={()=>{setPage(currentPage + 1)}}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
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
