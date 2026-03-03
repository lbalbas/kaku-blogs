import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "./loading";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "./PostCard";

dayjs.extend(relativeTime);

const Feed = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.blogs.getMostRecent.useInfiniteQuery(
    {
      limit: 9,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) return <LoadingBlock size={32} />;

  if (!data) return <div>Error while fetching, please try again.</div>;

  const allPosts = data.pages.flatMap((page) => page.items);

  return (
    <div className="flex w-full flex-col items-center gap-12">
      <div className="grid w-11/12 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
          className="rounded-full bg-teal-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-teal-700 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Feed;
