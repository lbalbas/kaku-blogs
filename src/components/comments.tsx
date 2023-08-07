import LoadingBlock from "./loading";
import { api } from "~/utils/api";
import {useState} from 'react';
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

const Comments = (props: {post: string}) => {
	const [comment, setComment] = useState("");
	const {post} = props;
	const {data, isLoading} = api.comments.getCommentsByPost.useQuery({post},{
		onError: () =>{
			console.log("error")
		}
	})
	const {mutate, isLoading: isPosting} = api.comments.makeComment.useMutation();
	
	if(isLoading) return <LoadingBlock size={18} />

	if(!data) return <div>Something went wrong!</div>

	const renderComments = (comments: Comment[]) => {
		return data.map(comment => {
			return (
			<div key={comment.id} className="flex flex-col">
				<div className="flex gap-4 items-center">
				<Link href={`/user/${comment.user.id}`} className="flex gap-1 items-center">
					<img className="rounded-full h-6 w-6" src={comment.user.image!} alt="Profile picture" />
					<span className="font-bold text-sm">{comment.user.name}</span>
				</Link>
				<span className="text-xs italic text-slate-500"></span>
				</div>
				<p>{comment.content}</p>
				<div>
					<button>Reply</button>
				</div>
				{(comment.childComments && comment.childComments.length > 0) ? (<div className="pl-2">{renderComments(comment.childComments)}</div>) : ""}
			</div>)
		})
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-col">
				<textarea maxLength={300} minLength={1} value={comment} onChange={(e)=>setComment(e.target.value)} />
				<button onClick={()=>mutate({content: comment, post})}>Comment</button>
			</div>
			{data.length == 0 ? (<p>No comments yet, be the first one!</p>) : renderComments(data)}
		</div>
	)
} 

export default Comments;
