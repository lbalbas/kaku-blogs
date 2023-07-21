import { api } from "~/utils/api";
import Link from 'next/link';
import LoadingBlock from "./loading";

const Feed = () => {
	const {data, isLoading} = api.blogs.getMostRecent.useQuery();

	if(isLoading) return <LoadingBlock size={32} />

	if(!data) return <div>No posts to show :(</div>

	return (
		<div className="flex flex-col p-2 w-8/12 gap-4">
			{data.map(post => {
				return (
					<div key={post.id} className="flex flex-col items-left">
						<Link className="text-sm flex gap-2 items-center" href={`/user/${post.userId}`}>{post.user.image && <img className="h-4 w-4" src={post.user.image}/>}{post.user.name}</Link>
						<Link className="text-xl font-bold" href={`/post/${post.id}`}>
							{post.title}
						</Link>
					</div>
					)
			})}	
		</div>
	)
}

export default Feed;