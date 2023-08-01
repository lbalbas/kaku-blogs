import { api } from "~/utils/api";
import Link from "next/link";
import LoadingBlock from "./loading";

const Feed = () => {
  const { data, isLoading } = api.blogs.getMostRecent.useQuery();

  if (isLoading) return <LoadingBlock size={32} />;

  if (!data) return <div>No posts to show :(</div>;

  return (
    <div className="grid bg-white w-11/12 rounded-md grid-cols-2 gap-5 p-6 lg:grid-cols-3">
      {data.map((post) => {
        return (
          <div key={post.id} className="border-hgreen border-l-4 pl-4 h-fit items-left flex flex-col">
            <Link
              className="flex items-center gap-2 text-sm"
              href={`/user/${post.userId}`}
            >
              {post.user.image && (
                <img className="h-5 w-5 rounded-full" src={post.user.image} />
              )}
              {post.user.name}
            </Link>
            <Link className="font-bold" href={`/post/${post.id}`}>
              {post.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
