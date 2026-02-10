import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    publishedAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

const PostCard = ({ post }: PostCardProps) => {
  // Helper to remove HTML tags and truncate text
  const getExcerpt = (html: string, length = 150) => {
    const text = html.replace(/<[^>]+>/g, "");
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Helper to calculate read time
  const getReadTime = (html: string) => {
    const text = html.replace(/<[^>]+>/g, "");
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
  };

  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
           <Link href={`/user/${post.user.id}`} className="flex items-center gap-2 group">
            {post.user.image ? (
                <Image
                src={post.user.image}
                alt={`${post.user.name}'s avatar`}
                width={24}
                height={24}
                className="rounded-full"
                />
            ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200" />
            )}
            <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                {post.user.name}
            </span>
           </Link>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {dayjs(post.publishedAt).fromNow()}
          </span>
        </div>

        <Link href={`/post/${post.id}`} className="group">
          <h3 className="mb-2 font-display text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {getExcerpt(post.content)}
          </p>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
            {getReadTime(post.content)}
        </span>
        {/* Placeholder for tags or likes in future */}
      </div>
    </div>
  );
};

export default PostCard;
