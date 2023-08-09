import LoadingBlock from "./loading";
import { api } from "~/utils/api";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { LoadingSpinner } from "./loading";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);

interface Comment {
  id: string;
  content: string;
  userId: string;
  blogPostId: string;
  createdAt: Date;
  parentCommentId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
  childComments?: Comment[];
}

const Comments = (props: { post: string }) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const { post } = props;

  const ctx = api.useContext();

  const { data, isLoading } = api.comments.getCommentsByPost.useQuery(
    { post },
    {
      onError: () => {
        console.log("error");
      },
    }
  );

  const { mutate: commentOnPost, isLoading: isPosting } =
    api.comments.makeComment.useMutation({
      onSuccess: () => {
        setComment("");
        toast.success("Commented successfully!");
        void ctx.comments.getCommentsByPost.invalidate();
      },
    });

  const { mutate: replyToComment, isLoading: isReplying } =
    api.comments.replyToComment.useMutation({
      onSuccess: () => {
        toast.success("Replied successfully!");
        setReply("");
        setReplyTo(null);
        void ctx.comments.getCommentsByPost.invalidate();
      },
    });

  if (isLoading) return <LoadingBlock size={18} />;

  if (!data) return <div>Something went wrong!</div>;

  const renderComments = (comments: Comment[], depth: number = 0) => {
    return comments.map((comment) => {
      return (
        <div key={comment.id} className="my-3 flex w-full flex-col">
          <div className="flex flex-col border-l-4 border-hgreen pl-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/user/${comment.user.id}`}
                className="flex items-center gap-1"
              >
                <img
                  className="h-6 w-6 rounded-full"
                  src={comment.user.image!}
                  alt="Profile picture"
                />
                <span className="text-sm font-bold">{comment.user.name}</span>
              </Link>
              <span className="text-xs italic text-slate-500"></span>
            </div>
            <p>{comment.content}</p>
            <div>
              <button
                className="text-xs text-slate-500"
                onClick={() => {
                  setReplyTo(comment.id);
                }}
              >
                Reply
              </button>
            </div>
          </div>
          {replyTo === comment.id && (
            <div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button
                disabled={isReplying}
                className="flex justify-center"
                onClick={() =>
                  replyToComment({
                    content: reply,
                    post,
                    parentCommentId: comment.id,
                  })
                }
              >
                {isReplying ? <LoadingSpinner size={16} /> : "Reply"}
              </button>
              <button onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          {comment.childComments && comment.childComments.length > 0 ? (
            depth < 2 || expandedComments.includes(comment.id) ? (
              <div className="-my-2 pl-4">
                {renderComments(comment.childComments, depth + 1)}
              </div>
            ) : (
              <button
                onClick={() =>
                  setExpandedComments([
                    ...expandedComments,
                    ...getAllChildCommentIds(comment),
                  ])
                }
              >
                Show more
              </button>
            )
          ) : (
            ""
          )}
        </div>
      );
    });
  };

  const getAllChildCommentIds = (comment: Comment) => {
    let ids = [comment.id];
    if (comment.childComments) {
      comment.childComments.forEach((childComment) => {
        ids = ids.concat(getAllChildCommentIds(childComment));
      });
    }
    return ids;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col">
        <textarea
          maxLength={300}
          minLength={1}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="flex justify-center"
          disabled={isPosting}
          onClick={() => commentOnPost({ content: comment, post })}
        >
          {isPosting ? <LoadingSpinner size={16} /> : "Comment"}
        </button>
      </div>
      {data.length == 0 ? (
        <p>No comments yet, be the first one!</p>
      ) : (
        renderComments(data, 0)
      )}
    </div>
  );
};

export default Comments;
