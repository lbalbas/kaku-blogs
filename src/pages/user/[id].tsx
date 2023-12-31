import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { useState } from 'react';
import type { GetStaticProps, NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import type { BlogPost } from '@prisma/client'
dayjs.extend(relativeTime);

const UserPage: NextPage<{ id: string }> = ({ id }) => {
  const [currentPage, setPage] = useState(0);
  const { data } = api.blogs.getAllByUserId.useQuery({ id });
  const { data: sessionData } = useSession();
  const ctx = api.useContext();

  if (!data)
    return (
      <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold">
        404 - Not Found
      </div>
    );

  const { user } = data;

  const { mutate: deletePost } = api.blogs.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully");
      void ctx.blogs.getAllByUserId.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to delete! Please try again later.");
      }
    },
  });

  const paginate = (array: BlogPost[], itemsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < array.length; i += itemsPerPage) {
      pages.push(array.slice(i, i + itemsPerPage));
    }
    return pages;
  }

  const posts = paginate(data.posts, 10);
  
  const iteratePosts = () => {
    if (posts.length === 0)
      return <p>{`This user hasn't published any posts yet.`}</p>;

    return posts[currentPage]!.map((post) => {
      return (
        <div
          key={post.id}
          className="group flex items-center gap-8 border-l-4 border-violet-900 p-3 pl-4"
        >
          <Link
            className="flex flex-col justify-center font-display text-lg"
            href={`/post/${post.id}`}
          >
            {post.title}
            <span className="text-xs italic text-slate-500">{`${dayjs().to(
              dayjs(post.publishedAt)
            )}`}</span>
          </Link>
          {sessionData && sessionData.user.id === user.id && (
            <div className="flex flex-col opacity-100 group-hover:opacity-100 lg:opacity-0">
              <Link href={`/post/edit/${post.id}`}>
                <FontAwesomeIcon size="xs" icon={faPenToSquare} />
              </Link>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this post?"))
                    deletePost({ id: post.id });
                }}
              >
                <FontAwesomeIcon size="xs" icon={faTrash} />
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mx-auto flex w-10/12 flex-col py-10 text-cyan-950">
      <Head>
        <title>{user.name} | Kaku Blogs</title>
      </Head>
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="flex flex-col items-center gap-2 font-display">
          <Image
            height={80}
            width={80}
            alt="User's profile picture"
            className="rounded-full"
            src={user.image ? user.image : ""}
          />
          <h1 className="text-center font-display text-2xl font-bold">
            {user.name}
          </h1>
        </div>
        <div className="flex flex-grow flex-col gap-3">
          <h2 className="text-2xl">Posts published</h2>
          {iteratePosts()}
          <div className="flex justify-center gap-2 items-center">
            <button disabled={currentPage <= 0} onClick={()=>{setPage(currentPage - 1)}}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>Page {`${currentPage + 1} of ${posts.length}`}</span>
            <button disabled={currentPage + 1 >= posts.length} onClick={()=>{setPage(currentPage + 1)}}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
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
