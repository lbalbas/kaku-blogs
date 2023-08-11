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
            <div className="w-full pl-4 py-2 flex flex-col gap-2">
              <textarea
                className="rounded-md border-2 border-slate-200 p-2"
                placeholder="Write your reply here."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="flex flex-row gap-4 justify-end">
              <button className="hover:text-red-500 hover:underline" onClick={() => setReplyTo(null)}>Cancel</button>
              <button
                disabled={isReplying}
                className="flex w-fit justify-center items-center self-end rounded-3xl bg-uviolet w-24 gap-1 py-2 text-white"
                onClick={() =>
                  replyToComment({
                    content: reply,
                    post,
                    parentCommentId: comment.id,
                  })
                }
              >
                {isReplying ? <LoadingSpinner size={24} /> : (<><FontAwesomeIcon icon={faReply} /> Reply</>) }
              </button>              </div>
            </div>
          )}
          {comment.childComments && comment.childComments.length > 0 ? (
            depth < 2 || expandedComments.includes(comment.id) ? (
              <div className="my-3 flex flex-col gap-3 pl-4">
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
      <h3 className="pt-4 pb-2 text-xl font-bold text-slate-600">Comments</h3>
      {sessionData && (
        <div className="flex flex-col gap-2">
          <textarea
            className="rounded-md border-2 border-slate-200 p-2"
            placeholder="Write your reply here."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="flex w-fit justify-center items-center self-end rounded-3xl bg-emerald-500 w-28 gap-1 py-2 text-white"
            disabled={isPosting}
            onClick={() => commentOnPost({ content: comment, post })}
          >
            {isPosting ? <LoadingSpinner size={24} /> : (<><FontAwesomeIcon icon={faComment} /> Comment</>)}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {data.length == 0 ? (
          <p className="text-center pt-8">No comments yet, be the first one!</p>
        ) : (
          renderComments(data, 0)
        )}
      </div>
    </div>
  );
};

export default Comments;
