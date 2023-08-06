import LoadingBlock from "./loading";
import { api } from "~/utils/api";
import Link from 'next/link';
import {useState} from 'react';

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

	const renderParentComments = () => {
		return data.map(comment => {
			return (
			<div className="flex flex-col">
				<Link href={`/user/${comment.user.id}`} className="flex gap-1 items-center">
					<img className="rounded-full h-6 w-6" src={comment.user.image!} alt="Profile picture" />
					<span className="font-bold text-sm">{comment.user.name}</span>
				</Link>
				<p>{comment.content}</p>
			</div>)
		})
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-col">
				<textarea maxLength={300} minLength={1} value={comment} onChange={(e)=>setComment(e.target.value)} />
				<button onClick={()=>mutate({content: comment, post})}>Comment</button>
			</div>
			{data.length == 0 ? (<p>No comments yet, be the first one!</p>) : renderParentComments(data)}
		</div>
	)
}

export default Comments;
