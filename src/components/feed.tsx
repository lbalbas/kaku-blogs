import { api } from "~/utils/api";
import Link from 'next/link';
import LoadingBlock from "./loading";

const Feed = () => {
	const {data, isLoading} = api.blogs.getMostRecent.useQuery();

	if(isLoading) return <LoadingBlock size={32} />

	if(!data) return <div>No posts to show :(</div>

	return (
		<div className="flex-col w-full gap-2">
			{data.map(post => {
				return <Link href={`/post/${post.id}`}>{post.title}</Link>
			})}	
		</div>
	)
}

export default Feed;