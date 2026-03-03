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

import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/user/${post.user.id}`}
            className="group flex items-center gap-2"
          >
            {post.user.image ? (
              <Image
                src={post.user.image}
                alt={`${post.user.name}'s avatar`}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-slate-800" />
            )}
            <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-teal-600 dark:text-slate-300 dark:group-hover:text-teal-400">
              {post.user.name}
            </span>
          </Link>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">
            {dayjs(post.publishedAt).fromNow()}
          </span>
        </div>

        <Link href={`/post/${post.id}`} className="group">
          <h3 className="mb-2 font-display text-xl font-bold text-slate-900 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-400">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
            {getExcerpt(post.content)}
          </p>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
          {getReadTime(post.content)}
        </span>
      </div>
    </motion.div>
  );
};

export default PostCard;
