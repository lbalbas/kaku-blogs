import LoadingBlock from "./loading";
import { api } from "~/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { LoadingSpinner } from "./loading";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faComment } from "@fortawesome/free-solid-svg-icons";

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

  const ctx = api.useContext();
  const { post } = props;
  const { data: sessionData } = useSession();

  const { data, isLoading } = api.comments.getCommentsByPost.useQuery(
    { post },
    {
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Unexpected error, please try again later.");
        }
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
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Unexpected error, please try again later.");
        }
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
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          console.log(errorMessage[0]);
          toast.error(errorMessage[0]);
        } else {
          toast.error("Unexpected error, please try again later.");
        }
      },
    });

  if (isLoading) return <LoadingBlock size={18} />;

  if (!data) return <div>Something went wrong!</div>;

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => {
      return (
        <div key={comment.id} className="flex w-full flex-col">
          <div className="flex flex-col border-l-4 border-red-500 pl-4">
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
                <span className="font-display text-sm font-bold text-slate-700">
                  {comment.user.name}
                </span>
              </Link>
              <span className="text-xs italic text-slate-500"></span>
            </div>
            <p>{comment.content}</p>
            <div>
              {sessionData && (
                <button
                  className="flex items-center justify-center gap-1 text-xs text-slate-500"
                  onClick={() => {
                    setReplyTo(comment.id);
                  }}
                >
                  <FontAwesomeIcon size="xs" icon={faReply} />
                  Reply
                </button>
              )}
            </div>
          </div>
          {replyTo === comment.id && (
            <div className="flex w-full flex-col gap-2 py-2 pl-4">
              <textarea
                className="rounded-md border-2 border-slate-200 p-2"
                placeholder="Write your reply here."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="flex flex-row justify-end gap-4">
                <button
                  className="hover:text-red-500 hover:underline"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </button>
                <button
                  disabled={isReplying}
                  className="flex w-32 items-center justify-center gap-1 self-end rounded-3xl bg-cyan-700 py-2 text-white hover:bg-cyan-800"
                  onClick={() =>
                    replyToComment({
                      content: reply,
                      post,
                      parentCommentId: comment.id,
                    })
                  }
                >
                  {isReplying ? (
                    <LoadingSpinner size={24} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faReply} /> Reply
                    </>
                  )}
                </button>{" "}
              </div>
            </div>
          )}
          {comment.childComments && comment.childComments.length > 0 ? (
            depth < 2 || expandedComments.includes(comment.id) ? (
              <div className="mt-3 flex flex-col gap-3 pl-4">
                {renderComments(comment.childComments, depth + 1)}
              </div>
            ) : (
              <button
                className="w-full p-2 pl-6 text-left text-sm text-blue-500 hover:underline"
                onClick={() =>
                  setExpandedComments([
                    ...expandedComments,
                    ...getAllChildCommentIds(comment),
                  ])
                }
              >
                (expand comments)
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
      <h3 className="pb-2 pt-4 font-display text-xl font-bold text-slate-600">
        Comments
      </h3>
      {sessionData && (
        <div className="flex flex-col gap-2">
          <textarea
            className="rounded-md border-2 border-slate-200 p-2"
            placeholder="Write your reply here."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="flex w-36 items-center justify-center gap-1 self-end rounded-3xl bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            disabled={isPosting}
            onClick={() => commentOnPost({ content: comment, post })}
          >
            {isPosting ? (
              <LoadingSpinner size={24} />
            ) : (
              <>
                <FontAwesomeIcon icon={faComment} /> Comment
              </>
            )}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {data.length == 0 ? (
          <p className="pt-8 text-center">No comments yet, be the first one!</p>
        ) : (
          renderComments(data, 0)
        )}
      </div>
    </div>
  );
};

export default Comments;
