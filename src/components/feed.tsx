import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "./loading";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "./PostCard";

dayjs.extend(relativeTime);

const Feed = () => {
  const { data, isLoading } = api.blogs.getMostRecent.useQuery();

  if (isLoading) return <LoadingBlock size={32} />;

  if (!data) return <div>Error while fetching, please try again.</div>;

  return (
    <div className="grid w-11/12 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
