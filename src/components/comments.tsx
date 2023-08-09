import LoadingBlock from "./loading";
import { api } from "~/utils/api";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

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
  const { post } = props;
  const { data, isLoading } = api.comments.getCommentsByPost.useQuery(
    { post },
    {
      onError: () => {
        console.log("error");
      },
    }
  );
  const { mutate: replyToComment, isLoading: isReplying } =
    api.comments.replyToComment.useMutation({
      onSuccess: () => {
        setReply("");
        setReplyTo(null);
      },
    });
  const { mutate: commentOnPost, isLoading: isPosting } =
    api.comments.makeComment.useMutation({
      onSuccess: () => {
        setComment("");
        //toast
      },
    });

  if (isLoading) return <LoadingBlock size={18} />;

  if (!data) return <div>Something went wrong!</div>;

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => {
      console.log(comment);
      return (
        <div key={comment.id} className="flex flex-col">
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
              onClick={() => {
                setReplyTo(comment.id);
              }}
            >
              Reply
            </button>
          </div>
          {replyTo === comment.id && (
            <div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button
                onClick={() =>
                  replyToComment({
                    content: reply,
                    post,
                    parentCommentId: comment.id,
                  })
                }
              >
                Reply
              </button>
              <button onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          {comment.childComments && comment.childComments.length > 0 ? (
            <div className="pl-4">{renderComments(comment.childComments)}</div>
          ) : (
            ""
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <textarea
          maxLength={300}
          minLength={1}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={() => commentOnPost({ content: comment, post })}>
          Comment
        </button>
      </div>
      {data.length == 0 ? (
        <p>No comments yet, be the first one!</p>
      ) : (
        renderComments(data)
      )}
    </div>
  );
};

export default Comments;
